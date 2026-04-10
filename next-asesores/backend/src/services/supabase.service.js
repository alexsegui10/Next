const { createClient } = require('@supabase/supabase-js');

let _client = null;

function getClient() {
  if (!_client) {
    const { SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY } = process.env;
    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error('Faltan variables de entorno SUPABASE_URL o SUPABASE_SERVICE_ROLE_KEY');
    }
    _client = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
  }
  return _client;
}

/**
 * Inserta un registro en la tabla citas_asesoria.
 * Crea la tabla automáticamente si no existe (requiere permisos de DDL).
 */
async function saveCita({ nombre, email, telefono, fecha, hora, tipo }) {
  const supabase = getClient();

  const { data, error } = await supabase
    .from('citas_asesoria')
    .insert([{ nombre, email, telefono, fecha: fecha ?? null, hora: hora ?? null, tipo }])
    .select()
    .single();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  return data;
}

module.exports = { saveCita };
