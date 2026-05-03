// Design tokens for the mobile OS shell.
// Frutiger Aero glossy icons on the home screen, opening into a luxury
// dark-mode interior — near-black surfaces, vibrant accents, generous space.

export const mobileTheme = {
  // Surfaces
  bg:           '#06080f',
  bgDeep:       '#03050a',
  bgElevated:   'rgba(255, 255, 255, 0.045)',
  bgRaised:     'rgba(255, 255, 255, 0.08)',
  bgGlass:      'rgba(12, 18, 32, 0.62)',

  // Frutiger-flavored accents
  accent:       '#5db4ff',
  accentSoft:   '#a8d8ff',
  accentDim:    '#2c7be0',
  accentBg:     'rgba(93, 180, 255, 0.14)',
  accentBorder: 'rgba(93, 180, 255, 0.36)',
  gold:         '#e8c875',

  // Text
  text:         '#f4f7ff',
  textSec:      'rgba(220, 232, 255, 0.74)',
  textMuted:    'rgba(160, 180, 215, 0.50)',

  // Status
  success:      '#4ed670',
  danger:       '#ff5e4e',

  // Hairlines
  border:       'rgba(255, 255, 255, 0.07)',
  borderStrong: 'rgba(255, 255, 255, 0.14)',

  // Fonts — match desktop's Inter / DM Sans, with Silkscreen reserved for OS branding.
  // fontMono is the brutalist clash partner used inside apps.
  fontUi:       "'Inter', system-ui, -apple-system, sans-serif",
  fontDisplay:  "'Archivo Black', 'DM Sans', 'Inter', system-ui, sans-serif",
  fontBrand:    "'Silkscreen', 'Courier New', monospace",
  fontMono:     "'Space Mono', ui-monospace, 'JetBrains Mono', 'IBM Plex Mono', monospace",
  fontSerif:    "'Cormorant Garamond', Georgia, serif",

  // Geometry
  radiusPill:   999,
  radiusCard:   18,
  radiusSheet:  28,
  navHeight:    52,
  statusHeight: 30,
} as const

// Section divider gradient used as a thin gilded hairline at the top of an app.
export const luxuryAccentLine = (color: string) =>
  `linear-gradient(90deg, transparent 0%, ${color}66 35%, ${color} 50%, ${color}66 65%, transparent 100%)`
