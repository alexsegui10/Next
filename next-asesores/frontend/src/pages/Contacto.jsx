import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCita } from '../hooks/useCita';

const INITIAL = { nombre: '', email: '', telefono: '' };

export default function Contacto() {
  const [form, setForm] = useState(INITIAL);
  const { mutate, isPending, isSuccess, isError, error, reset } = useCita();

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (isSuccess || isError) reset();
  }

  function handleSubmit(e) {
    e.preventDefault();
    mutate(
      { tipo: 'solicitud_cita', ...form },
      { onSuccess: () => setForm(INITIAL) }
    );
  }

  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section
        className="relative min-h-screen flex items-center pt-20 bg-geo overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #031634 0%, #1a2b4a 55%, #031634 100%)',
        }}
      >
        {/* Geo texture overlay */}
        <div className="absolute inset-0 bg-geo opacity-100 pointer-events-none" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-20 md:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

            {/* Left — Editorial headline */}
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-secondary-fixed-dim mb-6">
                Next Asesores & Abogados · Ontinyent
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter leading-none text-white mb-8">
                Excelencia<br />
                <span className="text-secondary-container">en Ontinyent.</span>
              </h1>
              <p className="text-on-primary-container text-lg leading-relaxed max-w-md mb-10">
                Más de 20 años de tradición jurídica y fiscal, con la visión tecnológica que tu empresa necesita hoy.
              </p>

              {/* Office info */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 text-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-secondary-container text-base">location_on</span>
                  C/ Major, 12 — 46870 Ontinyent, Valencia
                </div>
                <div className="flex items-center gap-3 text-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-secondary-container text-base">phone</span>
                  <a href="tel:+34962380000" className="hover:text-white transition-colors">+34 962 38 00 00</a>
                </div>
                <div className="flex items-center gap-3 text-sm text-on-primary-container">
                  <span className="material-symbols-outlined text-secondary-container text-base">mail</span>
                  <a href="mailto:info@nextasesores.es" className="hover:text-white transition-colors">info@nextasesores.es</a>
                </div>
              </div>

              <Link to="/calendario" className="btn-secondary mt-10 inline-flex text-white border-white/20 hover:bg-white/10">
                Ver disponibilidad
                <span className="material-symbols-outlined text-base">arrow_forward</span>
              </Link>
            </div>

            {/* Right — Glass form card */}
            <div>
              <div className="glass rounded-xl shadow-card p-8 md:p-10 border border-white/10">
                {!isSuccess ? (
                  <>
                    <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-on-surface-variant mb-1">
                      Solicitud de cita
                    </p>
                    <h2 className="text-2xl font-bold tracking-tight text-on-surface mb-8">
                      Te llamamos nosotros
                    </h2>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                      <div>
                        <label className="field-label">Nombre completo</label>
                        <input
                          className="field-input"
                          type="text"
                          name="nombre"
                          value={form.nombre}
                          onChange={handleChange}
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
                          onChange={handleChange}
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
                          onChange={handleChange}
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

                      <button type="submit" className="btn-primary w-full mt-2" disabled={isPending}>
                        {isPending ? (
                          <><Spinner /> Enviando…</>
                        ) : (
                          <>Solicitar cita <span className="material-symbols-outlined text-base">arrow_forward</span></>
                        )}
                      </button>

                      <p className="text-[11px] text-on-surface-variant text-center leading-relaxed">
                        Al enviar aceptas nuestra{' '}
                        <a href="#" className="underline hover:text-secondary transition-colors">
                          política de privacidad
                        </a>
                        . No compartiremos tus datos con terceros.
                      </p>
                    </form>
                  </>
                ) : (
                  <SuccessState onReset={() => reset()} />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Servicios strip ────────────────────────────────────────────── */}
      <section className="bg-surface-container-low py-20 md:py-28" id="servicios">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
          <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-secondary mb-4">
            Áreas de práctica
          </p>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-on-surface mb-14">
            ¿En qué podemos ayudarte?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICIOS_DATA.map(({ icon, titulo, descripcion }) => (
              <div key={titulo} className="card hover:shadow-card transition-shadow">
                <span className="material-symbols-outlined text-secondary text-3xl mb-4 block">{icon}</span>
                <h3 className="text-base font-bold tracking-tight text-on-surface mb-2">{titulo}</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">{descripcion}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SuccessState({ onReset }) {
  return (
    <div className="flex flex-col items-center text-center py-8 gap-6">
      <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center">
        <span className="material-symbols-outlined text-secondary text-3xl">check_circle</span>
      </div>
      <div>
        <h3 className="text-xl font-bold tracking-tight text-on-surface mb-2">¡Solicitud recibida!</h3>
        <p className="text-sm text-on-surface-variant leading-relaxed max-w-xs">
          Nos pondremos en contacto contigo en breve para confirmar tu cita.
        </p>
      </div>
      <button onClick={onReset} className="btn-secondary text-xs px-6 py-3">
        Nueva solicitud
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

const SERVICIOS_DATA = [
  {
    icon: 'account_balance',
    titulo: 'Asesoría Fiscal',
    descripcion: 'Planificación tributaria, IRPF, IVA, Impuesto de Sociedades y declaraciones anuales.',
  },
  {
    icon: 'gavel',
    titulo: 'Asesoría Jurídica',
    descripcion: 'Contratos mercantiles, constitución de sociedades, herencias y litigación civil.',
  },
  {
    icon: 'groups',
    titulo: 'Asesoría Laboral',
    descripcion: 'Nóminas, altas y bajas, EREs, negociación colectiva y relaciones laborales.',
  },
  {
    icon: 'trending_up',
    titulo: 'Gestión Contable',
    descripcion: 'Contabilidad empresarial, cierres anuales y presentación de cuentas.',
  },
  {
    icon: 'business',
    titulo: 'Derecho Mercantil',
    descripcion: 'Fusiones, adquisiciones, reestructuraciones societarias y due diligence.',
  },
  {
    icon: 'shield',
    titulo: 'Protección de Datos',
    descripcion: 'Adecuación RGPD, políticas de privacidad y gestión de incidencias.',
  },
];
