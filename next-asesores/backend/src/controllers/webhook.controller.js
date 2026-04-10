const { saveCita } = require('../services/supabase.service');
const { sendToOpenClaw, extractCallId } = require('../services/openclaw.service');

const VALID_TIPOS = ['solicitud_cita', 'confirmacion_cita'];

function isNonBlockingOpenClawError(err) {
  const msg = String(err?.message || '').toLowerCase();
  return msg.includes('email send failed') && msg.includes('insufficientpermissions');
}

async function handleWebhookAsesoria(req, res) {
  // Verificar secret si está configurado
  const secret = process.env.WEBHOOK_ASESORIA_SECRET;
  if (secret) {
    const incoming = req.headers['x-webhook-secret'];
    if (incoming !== secret) {
      return res.status(401).json({ error: 'No autorizado' });
    }
  }

  const { nombre, email, telefono, fecha, hora, tipo } = req.body ?? {};

  if (!nombre || !email || !telefono) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, telefono' });
  }

  if (!tipo || !VALID_TIPOS.includes(tipo)) {
    return res.status(400).json({
      error: `El campo 'tipo' debe ser uno de: ${VALID_TIPOS.join(', ')}`,
    });
  }

  // 1. Guardar en Supabase
  let supabaseRecord = null;
  try {
    supabaseRecord = await saveCita({ nombre, email, telefono, fecha, hora, tipo });
  } catch (err) {
    console.error('[webhook.asesoria] Supabase error:', err.message);
    return res.status(500).json({ error: 'No se pudo guardar la cita. Inténtalo de nuevo.' });
  }

  // 2. Disparar flujo OpenClaw (Retell → llamada → Calendar → WhatsApp)
  let callId = null;
  let warning = null;

  try {
    const openClawResult = await sendToOpenClaw(tipo, { nombre, email, telefono, fecha, hora });
    callId = extractCallId(openClawResult);
  } catch (err) {
    if (!isNonBlockingOpenClawError(err)) {
      console.error('[webhook.asesoria] OpenClaw error:', err.message);
      // No rollback Supabase — la cita está guardada, solo falla la llamada
      warning = `La cita se registró pero no se pudo iniciar la llamada: ${err.message}`;
    } else {
      warning = 'La llamada se inició, pero OpenClaw no pudo enviar el email de confirmación (permisos Google).';
    }
    console.warn('[webhook.asesoria]', warning);
  }

  return res.status(200).json({
    success: true,
    message: 'Cita registrada correctamente',
    id: supabaseRecord?.id ?? null,
    call_id: callId,
    warning: warning ?? null,
  });
}

module.exports = { handleWebhookAsesoria };
