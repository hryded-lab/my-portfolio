'use client'

import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

export type WindowId = 'about' | 'projects' | 'skills' | 'experience' | 'contact' | 'blog' | 'resume' | 'minesweeper' | 'notepad' | 'paint' | 'recyclebin' | 'assistant' | 'mediaplayer' | 'cmdprompt' | 'browser' | 'minecraft'

export type WindowConfig = {
  id: WindowId
  title: string
  icon: string
  defaultSize: { width: number; height: number }
  defaultPosition: { x: number; y: number }
}

export const WINDOWS: Record<WindowId, WindowConfig> = {
  about: {
    id: 'about',
    title: 'About Me — Hryday Lath',
    icon: '👤',
    defaultSize: { width: 580, height: 440 },
    defaultPosition: { x: 80, y: 60 },
  },
  projects: {
    id: 'projects',
    title: 'My Projects',
    icon: '📁',
    defaultSize: { width: 700, height: 500 },
    defaultPosition: { x: 160, y: 80 },
  },
  skills: {
    id: 'skills',
    title: 'Skills & Technologies',
    icon: '💻',
    defaultSize: { width: 600, height: 420 },
    defaultPosition: { x: 120, y: 100 },
  },
  experience: {
    id: 'experience',
    title: 'Experience & Education',
    icon: '🎓',
    defaultSize: { width: 580, height: 460 },
    defaultPosition: { x: 200, y: 70 },
  },
  contact: {
    id: 'contact',
    title: 'Contact Me',
    icon: '📧',
    defaultSize: { width: 500, height: 420 },
    defaultPosition: { x: 250, y: 90 },
  },
  blog: {
    id: 'blog',
    title: 'Blog — Thoughts',
    icon: '📝',
    defaultSize: { width: 620, height: 460 },
    defaultPosition: { x: 180, y: 80 },
  },
  resume: {
    id: 'resume',
    title: 'Resume — Hryday Lath.pdf',
    icon: '📄',
    defaultSize: { width: 700, height: 540 },
    defaultPosition: { x: 140, y: 50 },
  },
  minesweeper: {
    id: 'minesweeper',
    title: 'Minesweeper',
    icon: '💣',
    defaultSize: { width: 460, height: 520 },
    defaultPosition: { x: 300, y: 80 },
  },
  notepad: {
    id: 'notepad',
    title: 'Notepad',
    icon: '📋',
    defaultSize: { width: 500, height: 380 },
    defaultPosition: { x: 220, y: 100 },
  },
  paint: {
    id: 'paint',
    title: 'Paint',
    icon: '🎨',
    defaultSize: { width: 860, height: 600 },
    defaultPosition: { x: 100, y: 50 },
  },
  recyclebin: {
    id: 'recyclebin',
    title: 'Recycle Bin',
    icon: '🗑️',
    defaultSize: { width: 480, height: 320 },
    defaultPosition: { x: 280, y: 160 },
  },
  assistant: {
    id: 'assistant',
    title: 'Portfolio Assistant',
    icon: '🤖',
    defaultSize: { width: 540, height: 480 },
    defaultPosition: { x: 200, y: 80 },
  },
  mediaplayer: {
    id: 'mediaplayer',
    title: 'Windows Media Player',
    icon: '🎵',
    defaultSize: { width: 500, height: 480 },
    defaultPosition: { x: 240, y: 80 },
  },
  cmdprompt: {
    id: 'cmdprompt',
    title: 'Command Prompt',
    icon: '>_',
    defaultSize: { width: 640, height: 420 },
    defaultPosition: { x: 160, y: 90 },
  },
  browser: {
    id: 'browser',
    title: 'Internet Explorer',
    icon: '🌐',
    defaultSize: { width: 740, height: 480 },
    defaultPosition: { x: 120, y: 60 },
  },
  minecraft: {
    id: 'minecraft',
    title: 'Minecraft Classic',
    icon: '⛏️',
    defaultSize: { width: 900, height: 580 },
    defaultPosition: { x: 80, y: 40 },
  },
}

type WindowState = {
  id: WindowId
  isOpen: boolean
  isMinimized: boolean
  isMaximized: boolean
  position: { x: number; y: number }
  size: { width: number; height: number }
  zIndex: number
}

type WMContext = {
  windows: Record<WindowId, WindowState>
  activeWindowId: WindowId | null
  openWindow: (id: WindowId) => void
  closeWindow: (id: WindowId) => void
  minimizeWindow: (id: WindowId) => void
  maximizeWindow: (id: WindowId) => void
  restoreWindow: (id: WindowId) => void
  focusWindow: (id: WindowId) => void
  setPosition: (id: WindowId, pos: { x: number; y: number }) => void
  setSize: (id: WindowId, size: { width: number; height: number }) => void
  topZ: number
}

const WindowManagerContext = createContext<WMContext | null>(null)

export function WindowManagerProvider({ children }: { children: React.ReactNode }) {
  const topZRef = useRef(100)
  const [topZ, setTopZ] = useState(100)
  const [activeWindowId, setActiveWindowId] = useState<WindowId | null>(null)

  const initState = (): Record<WindowId, WindowState> => {
    const state: Partial<Record<WindowId, WindowState>> = {}
    for (const [id, cfg] of Object.entries(WINDOWS)) {
      state[id as WindowId] = {
        id: id as WindowId,
        isOpen: false,
        isMinimized: false,
        isMaximized: false,
        position: { ...cfg.defaultPosition },
        size: { ...cfg.defaultSize },
        zIndex: 100,
      }
    }
    return state as Record<WindowId, WindowState>
  }

  const [windows, setWindows] = useState<Record<WindowId, WindowState>>(initState)

  const bumpZ = useCallback(() => {
    topZRef.current += 1
    setTopZ(topZRef.current)
    return topZRef.current
  }, [])

  const openWindow = useCallback((id: WindowId) => {
    const z = bumpZ()
    setWindows(prev => ({
      ...prev,
      [id]: { ...prev[id], isOpen: true, isMinimized: false, zIndex: z, position: WINDOWS[id].defaultPosition, size: WINDOWS[id].defaultSize },
    }))
    setActiveWindowId(id)
  }, [bumpZ])

  const closeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isOpen: false, isMinimized: false, isMaximized: false } }))
    setActiveWindowId(prev => prev === id ? null : prev)
  }, [])

  const minimizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMinimized: true } }))
    setActiveWindowId(prev => prev === id ? null : prev)
  }, [])

  const maximizeWindow = useCallback((id: WindowId) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMaximized: true } }))
  }, [])

  const restoreWindow = useCallback((id: WindowId) => {
    const z = bumpZ()
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], isMinimized: false, isMaximized: false, zIndex: z } }))
    setActiveWindowId(id)
  }, [bumpZ])

  const focusWindow = useCallback((id: WindowId) => {
    const z = bumpZ()
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], zIndex: z, isMinimized: false } }))
    setActiveWindowId(id)
  }, [bumpZ])

  const setPosition = useCallback((id: WindowId, pos: { x: number; y: number }) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], position: pos } }))
  }, [])

  const setSize = useCallback((id: WindowId, size: { width: number; height: number }) => {
    setWindows(prev => ({ ...prev, [id]: { ...prev[id], size } }))
  }, [])

  return (
    <WindowManagerContext.Provider value={{ windows, activeWindowId, openWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, focusWindow, setPosition, setSize, topZ }}>
      {children}
    </WindowManagerContext.Provider>
  )
}

export function useWindowManager() {
  const ctx = useContext(WindowManagerContext)
  if (!ctx) throw new Error('useWindowManager must be used inside WindowManagerProvider')
  return ctx
}
