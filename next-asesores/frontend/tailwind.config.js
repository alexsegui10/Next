/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // ── Design tokens de Stitch (Next Asesores) ──────────────────────
        primary:                  '#031634',
        'primary-container':      '#1a2b4a',
        'primary-fixed':          '#d8e2ff',
        'primary-fixed-dim':      '#b6c6ee',
        'on-primary':             '#ffffff',
        'on-primary-container':   '#8293b7',

        secondary:                '#005cba',
        'secondary-container':    '#5095fe',
        'secondary-fixed':        '#d7e3ff',
        'secondary-fixed-dim':    '#aac7ff',
        'on-secondary':           '#ffffff',
        'on-secondary-container': '#002d61',

        tertiary:                 '#001730',
        'tertiary-container':     '#002c53',
        'on-tertiary':            '#ffffff',
        'on-tertiary-container':  '#5a95dc',

        background:               '#f9f9ff',
        surface:                  '#f9f9ff',
        'surface-dim':            '#d4daea',
        'surface-bright':         '#f9f9ff',
        'surface-tint':           '#4e5e80',
        'surface-variant':        '#dde2f3',
        'surface-container-lowest':  '#ffffff',
        'surface-container-low':     '#f1f3ff',
        'surface-container':         '#e8eeff',
        'surface-container-high':    '#e3e8f9',
        'surface-container-highest': '#dde2f3',

        'on-surface':             '#161c27',
        'on-surface-variant':     '#44474e',
        'inverse-surface':        '#2a303d',
        'inverse-on-surface':     '#ecf0ff',
        'inverse-primary':        '#b6c6ee',

        outline:                  '#75777e',
        'outline-variant':        '#c5c6cf',

        error:                    '#ba1a1a',
        'error-container':        '#ffdad6',
        'on-error':               '#ffffff',
        'on-error-container':     '#93000a',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        DEFAULT: '0.125rem',   // sharp — botones
        sm:      '0.125rem',
        md:      '0.25rem',
        lg:      '0.25rem',
        xl:      '0.75rem',    // cards
        '2xl':   '1rem',
        full:    '9999px',
      },
      boxShadow: {
        ambient: '0 12px 40px rgba(22,28,39,0.05)',
        card:    '0 4px 24px rgba(22,28,39,0.06)',
      },
    },
  },
  plugins: [],
};
