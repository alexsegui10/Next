import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-50 glass border-b border-outline-variant/10">
      <nav className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo */}
          <Link to="/contacto" className="shrink-0">
            <img
              src="https://www.nextasesores.es/wp-content/uploads/2023/11/Logo_Next_Asesores_ontinyent-2048x1106.png"
              alt="Next Asesores & Abogados"
              className="h-8 md:h-10 w-auto object-contain"
            />
          </Link>

          {/* Desktop CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <NavLink
              to="/calendario"
              className={({ isActive }) =>
                `text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-none transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'border border-outline/20 text-on-surface hover:bg-surface-container'
                }`
              }
            >
              Calendario
            </NavLink>
            <NavLink
              to="/contacto"
              className={({ isActive }) =>
                `text-xs font-semibold tracking-widest uppercase px-5 py-2.5 rounded-none transition-all ${
                  isActive
                    ? 'bg-primary text-on-primary'
                    : 'bg-secondary text-on-secondary hover:bg-primary'
                }`
              }
            >
              Cita previa
            </NavLink>
          </div>

          {/* Mobile hamburger */}
          <button
            className="sm:hidden p-2 text-on-surface-variant hover:text-on-surface transition-colors"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Cerrar menú' : 'Abrir menú'}
          >
            {open ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className="sm:hidden pb-4 flex flex-col gap-2 border-t border-outline-variant/10 pt-4">
            <NavLink
              to="/calendario"
              onClick={() => setOpen(false)}
              className="btn-secondary text-center text-xs py-3"
            >
              Calendario
            </NavLink>
            <NavLink
              to="/contacto"
              onClick={() => setOpen(false)}
              className="btn-primary text-center text-xs py-3"
            >
              Cita previa
            </NavLink>
          </div>
        )}
      </nav>
    </header>
  );
}
