// backend/src/services/slack.ts
// Powiadomienia operacyjne na Slacka (incoming webhook z SLACK_WEBHOOK_URL).
// Maile odpadają: skrzynka administratora na aftermarket.pl odbija pocztę z SES.

export async function sendSlack(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.warn("[Slack] Brak SLACK_WEBHOOK_URL - pomijam:", text.slice(0, 120));
    return;
  }
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) console.error(`[Slack] Webhook zwrócił ${res.status}`);
  } catch (error: any) {
    console.error("[Slack] Błąd wysyłki:", error.message);
  }
}
