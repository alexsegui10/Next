import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCita } from '../hooks/useCita';

const CALENDAR_EMBED_URL = import.meta.env.VITE_GOOGLE_CALENDAR_EMBED_URL || '';

const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30',
];

const INITIAL_FORM = { nombre: '', email: '', telefono: '' };

export default function Calendario() {
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [form, setForm] = useState(INITIAL_FORM);
  const { mutate, isPending, isSuccess, isError, error, reset } = useCita();

  function handleFormChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (isSuccess || isError) reset();
  }

  function handleSlotClick(slot) {
    setHora(slot);
    if (isSuccess || isError) reset();
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutate(
      { tipo: 'confirmacion_cita', ...form, fecha, hora },
      { onSuccess: () => { setForm(INITIAL_FORM); setFecha(''); setHora(''); } }
    );
  }

  const canSubmit = fecha && hora && form.nombre && form.email && form.telefono;

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative pt-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #031634 0%, #1a2b4a 55%, #031634 100%)' }}
      >
        <div className="absolute inset-0 bg-geo pointer-events-none" />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-24">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-secondary-fixed-dim mb-4">
            Disponibilidad en tiempo real
          </p>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white mb-4">
            Calendario de<br />
            <span className="text-secondary-container">disponibilidad.</span>
          </h1>
          <p className="text-on-primary-container text-base leading-relaxed max-w-xl">
            Consulta nuestra agenda actualizada y elige el momento que mejor se adapte a ti.
          </p>
        </div>
      </section>

      {/* ── Features strip ────────────────────────────────────────────── */}
      <section className="bg-surface-container-low">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {FEATURES.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-on-surface-variant">
                <span className="material-symbols-outlined text-secondary text-xl shrink-0">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main content ──────────────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-10 xl:gap-16">

            {/* Calendar embed — 3 cols */}
            <div className="xl:col-span-3">
              <h2 className="text-lg font-bold tracking-tight text-on-surface mb-6">
                Agenda en tiempo real
              </h2>
              {CALENDAR_EMBED_URL ? (
                <div className="rounded-xl overflow-hidden shadow-ambient bg-surface-container-lowest">
                  <iframe
                    src={CALENDAR_EMBED_URL}
                    title="Calendario de disponibilidad Next Asesores"
                    className="w-full"
                    style={{ height: 520, border: 'none' }}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="rounded-xl bg-surface-container-low flex flex-col items-center justify-center gap-3 text-center px-8"
                  style={{ height: 520 }}>
                  <span className="material-symbols-outlined text-outline text-5xl">calendar_month</span>
                  <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
                    Configura <code className="text-secondary bg-surface-container px-1 rounded text-xs">VITE_GOOGLE_CALENDAR_EMBED_URL</code> para mostrar la disponibilidad real.
                  </p>
                </div>
              )}
            </div>

            {/* Booking form — 2 cols */}
            <div className="xl:col-span-2">
              {isSuccess ? (
                <SuccessState onReset={() => reset()} />
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                  <h2 className="text-lg font-bold tracking-tight text-on-surface">
                    Confirmar cita
                  </h2>

                  {/* Date picker */}
                  <div>
                    <label className="field-label">Fecha</label>
                    <input
                      className="field-input"
                      type="date"
                      value={fecha}
                      min={new Date().toISOString().split('T')[0]}
                      onChange={(e) => { setFecha(e.target.value); if (isError) reset(); }}
                      required
                    />
                  </div>

                  {/* Time slots */}
                  <div>
                    <label className="field-label">Hora</label>
                    <div className="grid grid-cols-4 gap-1.5 mt-1">
                      {TIME_SLOTS.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => handleSlotClick(slot)}
                          className={`py-2 text-xs font-semibold tracking-wide rounded-none transition-all ${
                            hora === slot
                              ? 'bg-primary text-on-primary'
                              : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest hover:text-on-surface'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-surface-container-highest" />

                  {/* Personal data */}
                  <div>
                    <label className="field-label">Nombre completo</label>
                    <input
                      className="field-input"
                      type="text"
                      name="nombre"
                      value={form.nombre}
                      onChange={handleFormChange}
                      placeholder="María García López"
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">Correo electrónico</label>
                    <input
                      className="field-input"
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleFormChange}
                      placeholder="maria@empresa.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="field-label">Teléfono móvil</label>
                    <input
                      className="field-input"
                      type="tel"
                      name="telefono"
                      value={form.telefono}
                      onChange={handleFormChange}
                      placeholder="+34 612 345 678"
                      required
                    />
                  </div>

                  {isError && (
                    <div className="flex items-start gap-2 bg-error-container text-on-error-container rounded-xl px-4 py-3 text-sm">
                      <span className="material-symbols-outlined text-base shrink-0 mt-0.5">error</span>
                      {error?.message ?? 'Error al enviar la solicitud'}
                    </div>
                  )}

                  {/* Selected slot summary */}
                  {fecha && hora && (
                    <div className="flex items-center gap-2 bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface">
                      <span className="material-symbols-outlined text-secondary text-base">event</span>
                      <span className="font-medium">{fecha}</span>
                      <span className="text-on-surface-variant">·</span>
                      <span className="font-medium">{hora}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    className="btn-primary w-full"
                    disabled={isPending || !canSubmit}
                  >
                    {isPending ? (
                      <><Spinner /> Confirmando…</>
                    ) : (
                      <>Confirmar cita <span className="material-symbols-outlined text-base">check</span></>
                    )}
                  </button>

                  <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
                    Recibirás una llamada de confirmación en el número indicado.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA bottom ────────────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-on-surface mb-2">
              ¿Necesita asistencia inmediata?
            </h2>
            <p className="text-on-surface-variant text-sm">
              Llámanos directamente o usa el formulario de contacto rápido.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href="tel:+34962380000" className="btn-primary text-sm px-6 py-3">
              Llamar ahora
            </a>
            <Link to="/contacto" className="btn-secondary text-sm px-6 py-3">
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SuccessState({ onReset }) {
  return (
    <div className="flex flex-col items-center text-center py-12 gap-6">
      <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-secondary text-3xl">event_available</span>
      </div>
      <div>
        <h3 className="text-xl font-bold tracking-tight text-on-surface mb-2">¡Cita confirmada!</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
          Te llamaremos para confirmar los detalles. Revisa también tu correo electrónico.
        </p>
      </div>
      <button onClick={onReset} className="btn-secondary text-xs px-6 py-3">
        Reservar otra cita
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
    </svg>
  );
}

const FEATURES = [
  { icon: 'sync', label: 'Sincronización en tiempo real con nuestra agenda' },
  { icon: 'lock_clock', label: 'Reserva segura y confirmada al instante' },
  { icon: 'notifications_active', label: 'Recibirás llamada de confirmación automática' },
];
