const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

async function sendToOpenClaw(tipo, data) {
  const webhookUrl = process.env.OPENCLAW_ASESORIA_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('Falta OPENCLAW_ASESORIA_WEBHOOK_URL en variables de entorno');

  const payload = {
    nombre:   data.nombre,
    email:    data.email,
    telefono: data.telefono,
    tipo,
  };

  const response = await fetch(webhookUrl, {
    method:  'POST',
    headers: { 'Content-Type': 'application/json' },
    body:    JSON.stringify(payload),
  });

  const json = await response.json().catch(() => ({}));

  if (!response.ok || json.ok === false) {
    const details = json.error || json.message || `HTTP ${response.status}`;
    throw new Error(`OpenClaw error: ${details}`);
  }

  return json;
}

function extractCallId(result) {
  if (!result) return null;
  const r = result.result ?? {};
  return r.call?.call_id || r.call_id || r.callId || result.call_id || null;
}

module.exports = { sendToOpenClaw, extractCallId };
