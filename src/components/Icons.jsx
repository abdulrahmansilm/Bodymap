const base = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export const IconHome = ({ color = 'currentColor', size = 22 }) => (
  <svg {...base} width={size} height={size} stroke={color}>
    <path d="M3 11.5 12 4l9 7.5" />
    <path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9" />
  </svg>
)

export const IconChart = ({ color = 'currentColor', size = 22 }) => (
  <svg {...base} width={size} height={size} stroke={color}>
    <path d="M4 20V10" />
    <path d="M12 20V4" />
    <path d="M20 20v-7" />
  </svg>
)

export const IconList = ({ color = 'currentColor', size = 22 }) => (
  <svg {...base} width={size} height={size} stroke={color}>
    <path d="M8 6h12" />
    <path d="M8 12h12" />
    <path d="M8 18h12" />
    <path d="M4 6h.01" />
    <path d="M4 12h.01" />
    <path d="M4 18h.01" />
  </svg>
)

export const IconUser = ({ color = 'currentColor', size = 22 }) => (
  <svg {...base} width={size} height={size} stroke={color}>
    <circle cx="12" cy="8" r="3.5" />
    <path d="M4.5 20c1.4-3.6 4.4-5.5 7.5-5.5s6.1 1.9 7.5 5.5" />
  </svg>
)

export const IconDumbbell = ({ color = 'currentColor', size = 48 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24" stroke={color}>
    <path d="M6.5 6.5v11" />
    <path d="M17.5 6.5v11" />
    <path d="M4 9v6" />
    <path d="M20 9v6" />
    <path d="M8.5 12h7" />
  </svg>
)

export const IconCheckCircle = ({ color = 'currentColor', size = 64 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={1.6}>
    <circle cx="12" cy="12" r="9.5" />
    <path d="M8 12.5 10.8 15.3 16 9.5" />
  </svg>
)

export const IconLock = ({ color = 'currentColor', size = 14 }) => (
  <svg {...base} width={size} height={size} viewBox="0 0 24 24" stroke={color} strokeWidth={2}>
    <rect x="5" y="11" width="14" height="9" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
)
