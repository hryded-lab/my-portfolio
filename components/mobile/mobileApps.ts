// Canonical mobile app registry. Order within a page is row-major (4-col grid),
// chosen to tell a narrative on each page rather than mirror desktop alphabetical order.

export type AppId =
  | 'about'
  | 'experience'
  | 'projects'
  | 'skills'
  | 'resume'
  | 'blog'
  | 'contact'
  | 'restart'
  | 'notes'
  | 'terminal'
  | 'paint'
  | 'browser'
  | 'media'
  | 'minesweeper'
  | 'minecraft'
  | 'clock'

export type GlyphName = AppId

export type AppMeta = {
  id:    AppId
  label: string
  color: string
  page:  0 | 1
}

// Saturated Frutiger Aero palette (electric blues, dewy greens, sunshine,
// candy magenta) — looks alive under the glossy bubble shading.
export const APPS: AppMeta[] = [
  // Page 0 — essentials
  { id: 'about',       label: 'About',          color: '#4ab8ff', page: 0 },
  { id: 'experience',  label: 'Experience',     color: '#b783ff', page: 0 },
  { id: 'projects',    label: 'Projects',       color: '#4ed670', page: 0 },
  { id: 'skills',      label: 'Skills',         color: '#ffb83a', page: 0 },
  { id: 'resume',      label: 'Resume',         color: '#5d8aff', page: 0 },
  { id: 'blog',        label: 'Blog',           color: '#4ee8e8', page: 0 },
  { id: 'contact',     label: 'Contact',        color: '#ff8080', page: 0 },
  { id: 'restart',     label: 'Restart',        color: '#7cd0ff', page: 0 },

  // Page 1 — utilities + fun
  { id: 'notes',       label: 'Notes',          color: '#ffe14a', page: 1 },
  { id: 'terminal',    label: 'Phone Terminal', color: '#2a3a4f', page: 1 },
  { id: 'paint',       label: 'Paint',          color: '#ff7ec5', page: 1 },
  { id: 'browser',     label: 'My Tools',       color: '#7cd0ff', page: 1 },
  { id: 'media',       label: 'Media Player',   color: '#4674c7', page: 1 },
  { id: 'minesweeper', label: 'Minesweeper',    color: '#ff5e4e', page: 1 },
  { id: 'minecraft',   label: 'Minecraft',      color: '#8dc962', page: 1 },
  { id: 'clock',       label: 'Clock',          color: '#6cd1ff', page: 1 },
]

export function getApp(id: AppId): AppMeta {
  const a = APPS.find(x => x.id === id)
  if (!a) throw new Error(`Unknown app id: ${id}`)
  return a
}
