const { sendToOpenClaw, extractCallId } = require('../services/openclaw.service');

const VALID_TIPOS = ['solicitud_cita', 'confirmacion_cita'];

async function handleWebhookAsesoria(req, res) {
  const { nombre, email, telefono, fecha, hora, tipo } = req.body ?? {};

  if (!nombre || !email || !telefono) {
    return res.status(400).json({ error: 'Faltan campos obligatorios: nombre, email, telefono' });
  }

  if (!tipo || !VALID_TIPOS.includes(tipo)) {
    return res.status(400).json({
      error: `El campo 'tipo' debe ser uno de: ${VALID_TIPOS.join(', ')}`,
    });
  }

  try {
    const result = await sendToOpenClaw(tipo, { nombre, email, telefono, fecha, hora });
    const callId = extractCallId(result);

    return res.status(200).json({
      success: true,
      message: 'Cita registrada correctamente',
      call_id: callId ?? null,
    });
  } catch (err) {
    console.error('[webhook.asesoria] Error:', err.message);
    return res.status(500).json({ error: 'No se pudo procesar la solicitud. Inténtalo de nuevo.' });
  }
}

module.exports = { handleWebhookAsesoria };
