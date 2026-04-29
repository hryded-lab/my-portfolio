'use client'

import { createContext, useContext, useState } from 'react'

export type AppTheme = {
  mode: 'dark' | 'light'
  bg: string
  bgSecondary: string
  bgCard: string
  bgCardHover: string
  bgInput: string
  border: string
  borderLight: string
  text: string
  textSecondary: string
  textMuted: string
  accent: string
  accentBg: string
  accentBorder: string
  success: string
  successBg: string
  error: string
  errorBg: string
  tagBg: string
  tagBorder: string
  tagText: string
  headerBg: string
  selectedBg: string
  selectedText: string
  progressTrack: string
  menuBar: string
  menuBarText: string
  menuBarHover: string
  statusBar: string
  statusBarText: string
}

export const darkTheme: AppTheme = {
  mode: 'dark',
  bg: '#060b1a',
  bgSecondary: '#0a1020',
  bgCard: 'rgba(255,255,255,0.04)',
  bgCardHover: 'rgba(255,255,255,0.07)',
  bgInput: 'rgba(255,255,255,0.05)',
  border: 'rgba(125,249,255,0.15)',
  borderLight: 'rgba(125,249,255,0.07)',
  text: '#E8F4FF',
  textSecondary: '#a8c8e8',
  textMuted: '#4a6a8a',
  accent: '#7DF9FF',
  accentBg: 'rgba(125,249,255,0.08)',
  accentBorder: 'rgba(125,249,255,0.3)',
  success: '#A8FF78',
  successBg: 'rgba(168,255,120,0.1)',
  error: '#ff5566',
  errorBg: 'rgba(255,85,102,0.1)',
  tagBg: 'rgba(125,249,255,0.07)',
  tagBorder: 'rgba(125,249,255,0.2)',
  tagText: '#7DF9FF',
  headerBg: 'linear-gradient(135deg, rgba(5,8,22,0.95) 0%, rgba(13,27,62,0.95) 100%)',
  selectedBg: 'rgba(125,249,255,0.12)',
  selectedText: '#7DF9FF',
  progressTrack: 'rgba(255,255,255,0.05)',
  menuBar: 'rgba(4,8,20,0.6)',
  menuBarText: '#a8c8e8',
  menuBarHover: 'rgba(125,249,255,0.1)',
  statusBar: 'rgba(4,8,20,0.7)',
  statusBarText: '#4a6a8a',
}

export const lightTheme: AppTheme = {
  mode: 'light',
  bg: '#ffffff',
  bgSecondary: '#f6f8fa',
  bgCard: '#ffffff',
  bgCardHover: '#f6f8fa',
  bgInput: '#ffffff',
  border: '#d0d7de',
  borderLight: '#eaeef2',
  text: '#24292f',
  textSecondary: '#57606a',
  textMuted: '#8c959f',
  accent: '#0969da',
  accentBg: 'rgba(9,105,218,0.06)',
  accentBorder: 'rgba(9,105,218,0.2)',
  success: '#1a7f37',
  successBg: 'rgba(26,127,55,0.08)',
  error: '#cf222e',
  errorBg: 'rgba(207,34,46,0.08)',
  tagBg: '#ddf4ff',
  tagBorder: '#54aeff66',
  tagText: '#0969da',
  headerBg: 'linear-gradient(135deg, #f0f6fc 0%, #ddf4ff 100%)',
  selectedBg: 'rgba(9,105,218,0.08)',
  selectedText: '#0969da',
  progressTrack: '#eaeef2',
  menuBar: '#f6f8fa',
  menuBarText: '#57606a',
  menuBarHover: '#e6eaef',
  statusBar: '#f6f8fa',
  statusBarText: '#8c959f',
}

type ThemeContextType = {
  t: AppTheme
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  t: darkTheme,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [t, setT] = useState<AppTheme>(darkTheme)
  const toggle = () => setT(prev => prev.mode === 'dark' ? lightTheme : darkTheme)
  return (
    <ThemeContext.Provider value={{ t, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
