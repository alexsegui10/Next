const fetch = (...args) =>
  import('node-fetch').then(({ default: f }) => f(...args));

function buildPayload(tipo, data) {
  const normalizedFechaHora = (() => {
    if (data.fecha && data.hora) return `${data.fecha} ${data.hora}`;
    if (data.fecha_hora) return String(data.fecha_hora).replace('T', ' ');
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
  })();

  return {
    tipo: `FORMULARIO_${String(tipo).toUpperCase()}`,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    fecha_hora: normalizedFechaHora,
    duracion_min: 60,
    descripcion: data.descripcion || '-',
  };
}

async function sendToOpenClaw(tipo, data) {
  const webhookUrl = process.env.OPENCLAW_ASESORIA_WEBHOOK_URL;
  if (!webhookUrl) throw new Error('Falta OPENCLAW_ASESORIA_WEBHOOK_URL en variables de entorno');

  const payload = buildPayload(tipo, data);

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
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
