/**
 * Escapes HTML special characters for Telegram HTML parse_mode.
 */
export function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * Delivers a message to a Telegram chat ID using the bot token.
 * Uses HTML parse_mode. Falls back to plain text if Telegram rejects the formatting.
 */
export async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("[TelegramService] TELEGRAM_BOT_TOKEN is not set. Skipping send.");
    return;
  }

  const cleanChatId = String(chatId).trim();
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  console.log(`[TelegramService] Sending message to Telegram chatId: "${cleanChatId}"`);

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: cleanChatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    const resJson: any = await response.json().catch(() => null);

    if (!response.ok || !resJson?.ok) {
      console.warn(`[TelegramService] Telegram send failed with HTML parse_mode:`, resJson, `. Retrying in plain text...`);

      // Strip HTML tags for clean plain-text delivery
      const plainText = text.replace(/<[^>]*>/g, "");
      const fallbackResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: cleanChatId,
          text: plainText,
        }),
      });

      const fallbackJson: any = await fallbackResponse.json().catch(() => null);
      if (!fallbackResponse.ok || !fallbackJson?.ok) {
        console.error(`[TelegramService] Telegram plain text send also failed:`, fallbackJson);
      } else {
        console.log(`[TelegramService] Telegram message successfully sent (plain text fallback) to ${cleanChatId}`);
      }
    } else {
      console.log(`[TelegramService] Telegram message successfully delivered (HTML) to ${cleanChatId}`);
    }
  } catch (err) {
    console.error("[TelegramService] Exception during message send:", err);
  }
}

/**
 * Inspects a form's schema for enabled Telegram notifications, compiles a report of
 * the responder's submission answers, and sends the notification.
 */
export async function checkAndSendTelegramNotification(form: any, answers: Record<string, any>) {
  if (!form) {
    console.warn("[TelegramService] checkAndSendTelegramNotification called with null/empty form");
    return;
  }

  const schema = (form.schemaJson as any) || {};
  const publishedSchema = (form.publishedSchemaJson as any) || {};

  // Check both schemaJson and publishedSchemaJson for telegram settings
  const telegram =
    (schema.telegram?.chatId ? schema.telegram : null) ||
    (publishedSchema.telegram?.chatId ? publishedSchema.telegram : null) ||
    schema.telegram ||
    publishedSchema.telegram ||
    form.telegram;

  console.log(`[TelegramService] Checking form "${form.title}" (${form.id}) for Telegram notifications:`, {
    foundTelegramConfig: !!telegram,
    enabled: telegram?.enabled,
    chatId: telegram?.chatId,
    chatName: telegram?.chatName,
    answersCount: Object.keys(answers || {}).length,
  });

  if (!telegram || !telegram.enabled || !telegram.chatId) {
    console.log(`[TelegramService] Telegram notifications not enabled or chatId missing for form "${form.title}" (${form.id}). Skipping.`);
    return;
  }

  const chatId = String(telegram.chatId).trim();
  const formTitle = form.title || form.publishedTitle || "Untitled Form";

  // Use published fields if available, otherwise draft fields
  const fields: any[] =
    (Array.isArray(publishedSchema.fields) && publishedSchema.fields.length > 0)
      ? publishedSchema.fields
      : (Array.isArray(schema.fields) ? schema.fields : []);

  const escapedTitle = escapeHtml(formTitle);
  let message = `<b>🎉 New Submission for:</b> <i>${escapedTitle}</i>\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  const processedFieldIds = new Set<string>();

  for (const field of fields) {
    if (!field || !field.id) continue;
    processedFieldIds.add(field.id);
    const val = answers ? answers[field.id] : undefined;
    if (val !== undefined && val !== null && val !== "") {
      const displayValue = Array.isArray(val) ? val.join(", ") : String(val);
      const escapedLabel = escapeHtml(field.label || "Question");
      const escapedValue = escapeHtml(displayValue);
      message += `<b>👉 ${escapedLabel}</b>\n<code>${escapedValue}</code>\n\n`;
    }
  }

  // Also include any answers whose keys were not in fields
  if (answers && typeof answers === "object") {
    for (const [key, val] of Object.entries(answers)) {
      if (!processedFieldIds.has(key) && val !== undefined && val !== null && val !== "") {
        const displayValue = Array.isArray(val) ? val.join(", ") : String(val);
        const escapedLabel = escapeHtml(key);
        const escapedValue = escapeHtml(displayValue);
        message += `<b>👉 ${escapedLabel}</b>\n<code>${escapedValue}</code>\n\n`;
      }
    }
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `<i>Sent via <a href="https://formu.ai">Formu.AI</a></i>`;

  // Asynchronously dispatch the notification without blocking execution
  sendTelegramMessage(chatId, message).catch((err) =>
    console.error("[TelegramService] Error sending form notification:", err)
  );
}
