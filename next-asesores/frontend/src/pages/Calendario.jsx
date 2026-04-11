import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const API_KEY     = import.meta.env.VITE_GOOGLE_API_KEY     || '';
const CALENDAR_ID = import.meta.env.VITE_GOOGLE_CALENDAR_ID || '';

const FEATURES = [
  { icon: 'sync',                   label: 'Agenda actualizada en tiempo real' },
  { icon: 'lock_clock',             label: 'Reserva segura y confirmada' },
  { icon: 'notifications_active',   label: 'Confirmación automática por llamada' },
];

const STATS = [
  { value: '+20',  label: 'Años de experiencia' },
  { value: '500+', label: 'Clientes activos' },
  { value: '98%',  label: 'Satisfacción' },
];

const WEEKDAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

function isoDate(d) {
  return d.toISOString().slice(0, 10);
}

function startOfMonth(year, month) {
  return new Date(year, month, 1);
}

/* Returns monday-based day index 0–6 */
function mondayIndex(date) {
  return (date.getDay() + 6) % 7;
}

async function fetchEvents(year, month) {
  if (!API_KEY || !CALENDAR_ID) return [];

  const timeMin = new Date(year, month, 1).toISOString();
  const timeMax = new Date(year, month + 1, 0, 23, 59, 59).toISOString();

  const url =
    `https://www.googleapis.com/calendar/v3/calendars/` +
    `${encodeURIComponent(CALENDAR_ID)}/events` +
    `?key=${API_KEY}` +
    `&timeMin=${encodeURIComponent(timeMin)}` +
    `&timeMax=${encodeURIComponent(timeMax)}` +
    `&singleEvents=true` +
    `&orderBy=startTime` +
    `&maxResults=250`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Google API ${res.status}`);
  const data = await res.json();
  return data.items || [];
}

/* Groups events by date string "YYYY-MM-DD" */
function groupByDay(events) {
  const map = {};
  for (const ev of events) {
    const day = (ev.start?.date || ev.start?.dateTime || '').slice(0, 10);
    if (!day) continue;
    if (!map[day]) map[day] = [];
    map[day].push(ev);
  }
  return map;
}

function CalendarGrid({ year, month, eventsByDay, today }) {
  const first     = startOfMonth(year, month);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = mondayIndex(first); // blanks before day 1

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const todayStr = isoDate(today);

  return (
    <div>
      {/* Weekday headers */}
      <div className="grid grid-cols-7 mb-2">
        {WEEKDAYS.map(wd => (
          <div key={wd} className="text-center text-[10px] font-semibold tracking-widest uppercase text-on-surface-variant py-2">
            {wd}
          </div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (!day) return <div key={`blank-${i}`} />;

          const dateStr  = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const events   = eventsByDay[dateStr] || [];
          const hasEvent = events.length > 0;
          const isToday  = dateStr === todayStr;
          const isPast   = dateStr < todayStr;

          return (
            <div
              key={dateStr}
              title={events.map(e => e.summary || 'Ocupado').join('\n') || undefined}
              className={[
                'relative flex flex-col items-center justify-start pt-1.5 pb-1 rounded-lg min-h-[52px] cursor-default transition-all',
                isToday
                  ? 'bg-secondary text-on-secondary font-bold ring-2 ring-secondary ring-offset-1'
                  : hasEvent
                  ? 'bg-primary/10 text-primary'
                  : isPast
                  ? 'text-on-surface-variant/40'
                  : 'hover:bg-surface-container text-on-surface',
              ].join(' ')}
            >
              <span className="text-sm leading-none">{day}</span>

              {hasEvent && (
                <div className="mt-1 flex flex-col gap-0.5 w-full px-1 overflow-hidden max-h-[28px]">
                  {events.slice(0, 2).map((ev, idx) => (
                    <span
                      key={idx}
                      className={[
                        'block truncate text-[9px] font-medium leading-tight px-1 rounded',
                        isToday ? 'bg-on-secondary/20 text-on-secondary' : 'bg-secondary/15 text-secondary',
                      ].join(' ')}
                    >
                      {ev.summary || 'Ocupado'}
                    </span>
                  ))}
                  {events.length > 2 && (
                    <span className="text-[9px] text-on-surface-variant text-center">+{events.length - 2}</span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function Calendario() {
  const today   = new Date();
  const [view,  setView]   = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState('idle'); // idle | loading | error | ok | nokey

  useEffect(() => {
    if (!API_KEY || !CALENDAR_ID) { setStatus('nokey'); return; }

    setStatus('loading');
    fetchEvents(view.year, view.month)
      .then(evs => { setEvents(evs); setStatus('ok'); })
      .catch(() => setStatus('error'));
  }, [view.year, view.month]);

  const eventsByDay = groupByDay(events);

  const monthLabel = new Date(view.year, view.month, 1)
    .toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });

  function prevMonth() {
    setView(v => {
      const d = new Date(v.year, v.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }
  function nextMonth() {
    setView(v => {
      const d = new Date(v.year, v.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative pt-20 overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #031634 0%, #1a2b4a 55%, #031634 100%)' }}
      >
        <div className="absolute inset-0 bg-geo pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-14 md:py-20">
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

            <div className="flex gap-10 lg:gap-14 shrink-0">
              {STATS.map(({ value, label }) => (
                <div key={label} className="flex flex-col">
                  <span className="text-3xl md:text-4xl font-black tracking-tighter text-white">{value}</span>
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-on-primary-container mt-1">{label}</span>
                </div>
              ))}
            </div>
          </div>

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

          {/* Header row */}
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

          {/* Calendar card */}
          <div className="rounded-xl shadow-ambient bg-surface-container-lowest p-6 md:p-8">

            {/* Month navigation */}
            <div className="flex items-center justify-between mb-6">
              <button
                onClick={prevMonth}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Mes anterior"
              >
                <span className="material-symbols-outlined text-xl">chevron_left</span>
              </button>

              <h3 className="text-base font-bold tracking-tight text-on-surface capitalize">
                {monthLabel}
              </h3>

              <button
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-surface-container text-on-surface-variant hover:text-on-surface transition-colors"
                aria-label="Mes siguiente"
              >
                <span className="material-symbols-outlined text-xl">chevron_right</span>
              </button>
            </div>

            {/* States */}
            {status === 'nokey' && (
              <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
                <span className="material-symbols-outlined text-outline text-5xl">calendar_month</span>
                <p className="text-sm text-on-surface-variant max-w-xs leading-relaxed">
                  Añade <code className="text-secondary bg-surface-container-high px-1.5 py-0.5 rounded text-xs">VITE_GOOGLE_API_KEY</code> y <code className="text-secondary bg-surface-container-high px-1.5 py-0.5 rounded text-xs">VITE_GOOGLE_CALENDAR_ID</code> para mostrar la disponibilidad real.
                </p>
              </div>
            )}

            {status === 'loading' && (
              <div className="flex items-center justify-center gap-3 py-16 text-on-surface-variant text-sm">
                <span className="material-symbols-outlined text-secondary animate-spin text-2xl">progress_activity</span>
                Cargando agenda…
              </div>
            )}

            {status === 'error' && (
              <div className="flex flex-col items-center justify-center gap-3 py-16 text-center">
                <span className="material-symbols-outlined text-error text-4xl">error</span>
                <p className="text-sm text-on-surface-variant">No se pudo cargar el calendario. Inténtalo de nuevo.</p>
                <button
                  onClick={() => setView(v => ({ ...v }))}
                  className="text-xs font-semibold text-secondary hover:underline"
                >
                  Reintentar
                </button>
              </div>
            )}

            {(status === 'ok') && (
              <CalendarGrid
                year={view.year}
                month={view.month}
                eventsByDay={eventsByDay}
                today={today}
              />
            )}

            {/* Legend */}
            {status === 'ok' && (
              <div className="flex flex-wrap gap-4 mt-6 pt-4 border-t border-outline-variant text-xs text-on-surface-variant">
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-secondary inline-block" /> Hoy
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-primary/10 inline-block" /> Con citas
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-sm bg-surface-container inline-block border border-outline-variant" /> Disponible
                </span>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-on-surface-variant text-center">
            ¿Ves un hueco que te encaja?{' '}
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
