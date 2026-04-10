-- Tabla de citas para Next Asesores & Abogados
-- Ejecutar en Supabase → SQL Editor

CREATE TABLE IF NOT EXISTS citas_asesoria (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre      text        NOT NULL,
  email       text        NOT NULL,
  telefono    text        NOT NULL,
  fecha       date,
  hora        text,
  tipo        text        NOT NULL CHECK (tipo IN ('solicitud_cita', 'confirmacion_cita')),
  created_at  timestamptz DEFAULT now()
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_citas_asesoria_created_at ON citas_asesoria (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_citas_asesoria_email      ON citas_asesoria (email);

-- RLS: solo el service role puede escribir; nadie lee desde el cliente
ALTER TABLE citas_asesoria ENABLE ROW LEVEL SECURITY;
