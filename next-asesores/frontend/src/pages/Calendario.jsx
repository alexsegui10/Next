import { Link } from 'react-router-dom';

const CALENDAR_EMBED_URL = import.meta.env.VITE_GOOGLE_CALENDAR_EMBED_URL || '';

const FEATURES = [
  { icon: 'sync', label: 'Agenda actualizada en tiempo real' },
  { icon: 'lock_clock', label: 'Reserva segura y confirmada' },
  { icon: 'notifications_active', label: 'Confirmación automática por llamada' },
];

const STATS = [
  { value: '+20', label: 'Años de experiencia' },
  { value: '500+', label: 'Clientes activos' },
  { value: '98%', label: 'Satisfacción' },
];

export default function Calendario() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative pt-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #031634 0%, #1a2b4a 55%, #031634 100%)' }}
      >
        <div className="absolute inset-0 bg-geo pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-14 md:py-20">
          {/* Top row — headline + stats */}
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-12">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-secondary-fixed-dim mb-4">
                Disponibilidad en tiempo real
              </p>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none text-white">
                Calendario de<br />
                <span className="text-secondary-container">disponibilidad.</span>
              </h1>
            </div>

            {/* Stats strip */}
            <div className="flex gap-10 lg:gap-14 shrink-0">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black tracking-tighter text-white">{value}</span>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-on-primary-container mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Features strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-10 border-b border-white/10">
            {FEATURES.map(({ icon, label }) => (
              <div key={label} className="flex items-center gap-3 text-sm text-on-primary-container">
                <span className="material-symbols-outlined text-secondary-container text-xl shrink-0">{icon}</span>
                {label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Calendar ──────────────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-secondary mb-1">
                Agenda Next Asesores
              </p>
              <h2 className="text-xl font-bold tracking-tight text-on-surface">
                Consulta nuestros horarios disponibles
              </h2>
            </div>
            <Link to="/contacto" className="btn-primary text-xs px-6 py-3 shrink-0">
              Solicitar cita
              <span className="material-symbols-outlined text-base">arrow_forward</span>
            </Link>
          </div>

          {CALENDAR_EMBED_URL ? (
            <div className="rounded-xl overflow-hidden shadow-ambient bg-surface-container-lowest">
              <iframe
                src={CALENDAR_EMBED_URL}
                title="Calendario de disponibilidad Next Asesores"
                className="w-full"
                style={{ height: 680, border: 'none' }}
                loading="lazy"
              />
            </div>
          ) : (
            <div
              className="rounded-xl bg-surface-container flex flex-col items-center justify-center gap-4 text-center px-8"
              style={{ height: 680 }}
            >
              <span className="material-symbols-outlined text-outline text-6xl">calendar_month</span>
              <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
                Configura <code className="text-secondary bg-surface-container-high px-1.5 py-0.5 rounded text-xs">VITE_GOOGLE_CALENDAR_EMBED_URL</code> para mostrar la disponibilidad real.
              </p>
            </div>
          )}

          <p className="mt-4 text-xs text-on-surface-variant text-center">
            ¿Ves un horario que te encaja?{' '}
            <Link to="/contacto" className="text-secondary hover:underline font-medium">
              Solicita tu cita aquí
            </Link>
            {' '}y te confirmamos en minutos.
          </p>
        </div>
      </section>

      {/* ── Info cards ────────────────────────────────────────────────── */}
      <section className="bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="card flex flex-col gap-4">
              <span className="material-symbols-outlined text-secondary text-3xl">schedule</span>
              <h3 className="text-base font-bold tracking-tight text-on-surface">Horario de atención</h3>
              <div className="flex flex-col gap-1 text-sm text-on-surface-variant">
                <p>Lunes – Viernes: <span className="text-on-surface font-medium">9:00 – 14:00</span></p>
                <p>Tarde: <span className="text-on-surface font-medium">16:00 – 19:00</span></p>
                <p>Sábados: <span className="text-on-surface font-medium">Con cita previa</span></p>
              </div>
            </div>

            <div className="card flex flex-col gap-4">
              <span className="material-symbols-outlined text-secondary text-3xl">location_on</span>
              <h3 className="text-base font-bold tracking-tight text-on-surface">Dónde estamos</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                C/ Major, 12<br />
                46870 Ontinyent, Valencia<br />
                <a href="tel:+34962380000" className="text-secondary hover:underline font-medium">+34 962 38 00 00</a>
              </p>
            </div>

            <div className="card flex flex-col gap-4">
              <span className="material-symbols-outlined text-secondary text-3xl">video_call</span>
              <h3 className="text-base font-bold tracking-tight text-on-surface">Consulta online</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                También ofrecemos reuniones por videollamada para mayor comodidad.
              </p>
              <Link to="/contacto" className="text-xs font-semibold tracking-wider uppercase text-secondary hover:underline mt-auto">
                Solicitar consulta online →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA bottom ────────────────────────────────────────────────── */}
      <section className="bg-primary py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white mb-2">
              ¿Necesita asistencia inmediata?
            </h2>
            <p className="text-on-primary-container text-sm">
              Llámanos directamente o usa el formulario de contacto.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <a href="tel:+34962380000" className="inline-flex items-center justify-center gap-2 bg-secondary text-on-secondary px-8 py-4 text-sm font-semibold tracking-wider uppercase rounded-none hover:bg-secondary-container transition-all">
              <span className="material-symbols-outlined text-base">phone</span>
              Llamar ahora
            </a>
            <Link to="/contacto" className="inline-flex items-center justify-center gap-2 border border-white/20 text-white px-8 py-4 text-sm font-semibold tracking-wider uppercase rounded-none hover:bg-white/10 transition-all">
              Contactar
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
