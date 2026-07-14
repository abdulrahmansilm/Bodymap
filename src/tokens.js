export const T = {
  primary: '#00B4D8',
  primaryDark: '#0096C7',
  primaryLight: '#48CAE4',
  primaryTint: '#F0FBFF',
  primaryBorder: '#CAF0F8',
  surface: '#FFFFFF',
  surface1: '#F8FAFC',
  surface2: '#EFF3F6',
  textPrimary: '#0D1B2A',
  textSecondary: '#33414F',
  textMuted: '#9CA3AF',
  textOnPrimary: '#FFFFFF',
  border: '#E5E7EB',
  borderStrong: '#CBD5E1',
  danger: '#C0392B',
  dangerTint: '#FDF0EE',
  success: '#10B981',
  successTint: '#F0FFF4',
  radiusSm: 8,
  radiusMd: 14,
  radiusLg: 18,
}

export const btn = (variant = 'primary') => ({
  primary: {
    background: T.primary, color: '#fff',
    border: 'none', borderRadius: 16,
    padding: '16px 0', width: '100%',
    fontSize: 16, fontWeight: 700,
    fontFamily: 'inherit', cursor: 'pointer',
    boxShadow: '0 6px 20px rgba(0,180,216,0.35)',
  },
  secondary: {
    background: '#fff', color: T.primary,
    border: `2px solid ${T.primary}`, borderRadius: 16,
    padding: '16px 0', width: '100%',
    fontSize: 16, fontWeight: 700,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  ghost: {
    background: 'transparent', color: T.primary,
    border: `0.5px solid ${T.primaryBorder}`, borderRadius: 14,
    padding: '15px 0', width: '100%',
    fontSize: 15, fontWeight: 500,
    fontFamily: 'inherit', cursor: 'pointer',
  },
  disabled: {
    background: T.border, color: T.textMuted,
    border: 'none', borderRadius: 16,
    padding: '16px 0', width: '100%',
    fontSize: 16, fontWeight: 700,
    fontFamily: 'inherit', cursor: 'not-allowed',
  }
}[variant])

export const card = (active = false) => ({
  border: `2px solid ${active ? T.primary : T.border}`,
  borderRadius: 16,
  background: active ? T.primaryTint : '#fff',
  padding: '16px 18px',
  cursor: 'pointer',
  marginBottom: 10,
  transition: 'all 0.2s',
  boxShadow: active ? `inset 4px 0 0 ${T.primary}` : 'none',
})

export const circleOpt = (active = false, size = 52) => ({
  width: size, height: size, borderRadius: '50%',
  border: `2px solid ${active ? T.primary : T.border}`,
  background: active ? T.primary : '#fff',
  color: active ? '#fff' : T.textMuted,
  fontSize: 14, fontWeight: 700, fontFamily: 'inherit', cursor: 'pointer',
  boxShadow: active ? '0 4px 15px rgba(0,180,216,0.4)' : 'none',
  transition: 'all 0.2s',
})

export const chip = (active = false) => ({
  padding: '10px 18px', borderRadius: 50,
  border: `2px solid ${active ? T.primary : T.border}`,
  background: active ? T.primaryTint : '#fff',
  color: active ? T.primaryDark : T.textPrimary,
  fontSize: 14, fontWeight: active ? 700 : 500,
  fontFamily: 'inherit', cursor: 'pointer',
  transition: 'all 0.2s',
})
