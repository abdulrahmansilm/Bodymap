export const T = {
  primary: '#1B4332',
  primaryLight: '#2D6A4F',
  primaryTint: '#EEF6F1',
  primaryBorder: '#B7DFCA',
  surface: '#FFFFFF',
  surface1: '#F8F9F7',
  surface2: '#F0F2EE',
  textPrimary: '#111810',
  textSecondary: '#3D4A3E',
  textMuted: '#6B7A6C',
  textOnPrimary: '#FFFFFF',
  border: '#E2E6E0',
  borderStrong: '#C8CEC6',
  danger: '#C0392B',
  dangerTint: '#FDF0EE',
  radiusSm: 8,
  radiusMd: 12,
  radiusLg: 16,
}

export const btn = (variant = 'primary') => ({
  primary: {
    background: '#1B4332', color: '#fff',
    border: 'none', borderRadius: 14,
    padding: '15px 0', width: '100%',
    fontSize: 16, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  secondary: {
    background: '#F0F2EE', color: '#1B4332',
    border: '0.5px solid #B7DFCA', borderRadius: 14,
    padding: '15px 0', width: '100%',
    fontSize: 16, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  ghost: {
    background: 'transparent', color: '#1B4332',
    border: '0.5px solid #B7DFCA', borderRadius: 14,
    padding: '15px 0', width: '100%',
    fontSize: 15, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  disabled: {
    background: '#E2E6E0', color: '#6B7A6C',
    border: 'none', borderRadius: 14,
    padding: '15px 0', width: '100%',
    fontSize: 16, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'not-allowed',
  }
}[variant])

export const card = (active = false) => ({
  border: `0.5px solid ${active ? '#2D6A4F' : '#E2E6E0'}`,
  borderRadius: 14,
  background: active ? '#EEF6F1' : '#fff',
  padding: '14px 16px',
  cursor: 'pointer',
  marginBottom: 10,
})