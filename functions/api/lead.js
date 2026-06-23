export async function onRequestPost({ request, env }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Ungültiges JSON" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { vorname, email } = data;
  if (!vorname || !email) {
    return new Response(JSON.stringify({ error: "Vorname und E-Mail erforderlich" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (env.LEAD_WEBHOOK_URL) {
    try {
      await fetch(env.LEAD_WEBHOOK_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vorname, email, timestamp: new Date().toISOString() }),
      });
    } catch {
      // Webhook-Fehler nicht an den Client weitergeben
    }
  }

  return new Response(JSON.stringify({ success: true, message: "Lead erfolgreich gespeichert" }), {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
