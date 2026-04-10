import { Link } from 'react-router-dom';

const SERVICIOS = ['Asesoría Fiscal', 'Asesoría Laboral', 'Asesoría Jurídica', 'Gestión Contable', 'Derecho Mercantil'];
const LEGAL = ['Aviso Legal', 'Política de Privacidad', 'Política de Cookies', 'Sitemap'];

export default function Footer() {
  return (
    <footer className="bg-primary text-on-primary">
      <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">

          {/* Col 1 — Marca */}
          <div>
            <img
              src="https://www.nextasesores.es/wp-content/uploads/2023/11/Logo_Next_Asesores_ontinyent-2048x1106.png"
              alt="Next Asesores & Abogados"
              className="h-8 w-auto object-contain brightness-0 invert mb-6"
            />
            <p className="text-on-primary-container text-sm leading-relaxed max-w-xs">
              Asesoría jurídica, fiscal y laboral en Ontinyent. Más de 20 años acompañando a empresas y particulares.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm text-on-primary-container">
              <a href="tel:+34962380000" className="hover:text-on-primary transition-colors">
                +34 962 38 00 00
              </a>
              <a href="mailto:info@nextasesores.es" className="hover:text-on-primary transition-colors">
                info@nextasesores.es
              </a>
            </div>
          </div>

          {/* Col 2 — Servicios */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-on-primary-container mb-5">
              Servicios
            </p>
            <ul className="flex flex-col gap-3">
              {SERVICIOS.map((s) => (
                <li key={s}>
                  <a href="#servicios" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 — Legal + Newsletter */}
          <div>
            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-on-primary-container mb-5">
              Legal
            </p>
            <ul className="flex flex-col gap-3 mb-10">
              {LEGAL.map((l) => (
                <li key={l}>
                  <a href="#" className="text-sm text-on-primary-container hover:text-on-primary transition-colors">
                    {l}
                  </a>
                </li>
              ))}
            </ul>

            <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-on-primary-container mb-4">
              Cita rápida
            </p>
            <Link to="/contacto" className="btn-primary text-xs px-5 py-3 inline-flex">
              Solicitar cita
            </Link>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-on-primary-container">
            © {new Date().getFullYear()} Next Asesores & Abogados, S.L. Todos los derechos reservados.
          </p>
          <p className="text-xs text-on-primary-container">
            Ontinyent, Valencia
          </p>
        </div>
      </div>
    </footer>
  );
}
