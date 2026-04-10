import { useMutation } from '@tanstack/react-query';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3002';

async function postCita(payload) {
  const res = await fetch(`${API_URL}/webhook/asesoria`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  let data;
  const raw = await res.text();
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error('La API no devolvió una respuesta válida. Comprueba VITE_API_URL.');
  }

  if (!res.ok) {
    throw new Error(data.error || 'Error al enviar la solicitud');
  }

  return data;
}

export function useCita() {
  return useMutation({ mutationFn: postCita });
}
