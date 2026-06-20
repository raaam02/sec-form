/**
 * Escapes Markdown special characters for Telegram legacy Markdown parse_mode.
 * In legacy Markdown, we escape '_', '*', and '['.
 */
export function escapeMarkdown(text: string): string {
  return text.replace(/([_*\[])/g, "\\$1");
}

/**
 * Delivers a message to a Telegram chat ID using the bot token.
 * Falls back to unformatted text if Telegram rejects the Markdown formatting.
 */
export async function sendTelegramMessage(chatId: string, text: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) {
    console.warn("[TelegramService] TELEGRAM_BOT_TOKEN is not set. Skipping send.");
    return;
  }

  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    const escaped = escapeMarkdown(text);
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text: escaped,
        parse_mode: "Markdown",
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn(`[TelegramService] Telegram send failed with Markdown: ${errText}. Retrying as plain text...`);

      // Fallback: Send message in plain text (no Markdown formatting, no escaping)
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

  let message = `*New Submission for:* ${formTitle}\n`;
  message += `-----------------------------------------\n\n`;

  for (const field of fields) {
    const val = answers[field.id];
    if (val !== undefined && val !== null) {
      const displayValue = Array.isArray(val) ? val.join(", ") : String(val);
      message += `*${field.label}*\n${displayValue}\n\n`;
    }
  }

  message += `-----------------------------------------\n`;
  message += `_Sent via Formu.AI_`;

  // Asynchronously dispatch the notification without blocking execution
  sendTelegramMessage(chatId, message).catch((err) =>
    console.error("[TelegramService] Error sending form notification:", err)
  );
}
