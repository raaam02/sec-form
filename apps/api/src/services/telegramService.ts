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

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: "HTML",
        disable_web_page_preview: true,
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[TelegramService] Telegram send failed with HTML: ${errText}. Retrying as plain text...`);

      // Fallback: Send message in plain text (no HTML parse mode)
      const fallbackResponse = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
        }),
      });

      if (!fallbackResponse.ok) {
        const fallbackErr = await fallbackResponse.text();
        console.error(`[TelegramService] Telegram send failed in plain text: ${fallbackErr}`);
      }
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
  if (!form || !form.schemaJson) return;

  const schema = form.schemaJson as any;
  const telegram = schema.telegram;

  if (!telegram || !telegram.enabled || !telegram.chatId) {
    return;
  }

  const chatId = telegram.chatId;
  const formTitle = form.title || "Untitled Form";
  const fields = schema.fields || [];

  const escapedTitle = escapeHtml(formTitle);
  let message = `<b>🎉 New Submission for:</b> <i>${escapedTitle}</i>\n`;
  message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n\n`;

  for (const field of fields) {
    const val = answers[field.id];
    if (val !== undefined && val !== null) {
      const displayValue = Array.isArray(val) ? val.join(", ") : String(val);
      const escapedLabel = escapeHtml(field.label);
      const escapedValue = escapeHtml(displayValue);
      message += `<b>👉 ${escapedLabel}</b>\n<code>${escapedValue}</code>\n\n`;
    }
  }

  message += `━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
  message += `<i>Sent via <a href="https://formu.ai">Formu.AI</a></i>`;

  // Asynchronously dispatch the notification without blocking execution
  sendTelegramMessage(chatId, message).catch((err) =>
    console.error("[TelegramService] Error sending form notification:", err)
  );
}
