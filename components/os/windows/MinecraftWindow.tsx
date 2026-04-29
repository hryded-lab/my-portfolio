'use client'

import { useState } from 'react'
import { useWindowManager } from '@/lib/windowManager'

export default function MinecraftWindow() {
  const { closeWindow } = useWindowManager()
  const [hovered, setHovered] = useState<string | null>(null)
  const [imgSrc] = useState(() => `/minecraft-bg.jpg?v=${Math.random().toString(36).slice(2)}`)

  return (
    <div style={{
      width: '100%', height: '100%', overflow: 'hidden',
      position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: "'Silkscreen', 'Courier New', monospace",
      imageRendering: 'pixelated',
    }}>

      {/* Background photo */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={imgSrc} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'fill' }} />

      {/* Dark vignette */}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.32)' }} />

      {/* Menu buttons — centered via parent flex */}
      <div style={{
        position: 'relative', zIndex: 1,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
        width: 320,
      }}>
        <MCButton label="Singleplayer" hovered={hovered} setHovered={setHovered}
          onClick={() => window.open('https://classic.minecraft.net', '_blank')} />
        <MCButton label="Multiplayer" hovered={hovered} setHovered={setHovered} disabled />
        <MCButton label="Mods and Texture Packs" hovered={hovered} setHovered={setHovered} disabled />
        <div style={{ display: 'flex', gap: 4, width: '100%', marginTop: 2 }}>
          <MCButton label="Options..." hovered={hovered} setHovered={setHovered} disabled flex />
          <MCButton label="Quit Game" hovered={hovered} setHovered={setHovered} flex
            onClick={() => closeWindow('minecraft')} />
        </div>
      </div>

      {/* Copyright */}
      <div style={{
        position: 'absolute', bottom: 8, left: 10, zIndex: 2,
        fontSize: 9, color: 'rgba(255,255,255,0.45)',
        textShadow: '1px 1px 0 #000', userSelect: 'none',
      }}>
        Copyright Mojang AB. Do not distribute!
      </div>
    </div>
  )
}

function MCButton({ label, onClick, hovered, setHovered, disabled, flex }: {
  label: string
  onClick?: () => void
  hovered: string | null
  setHovered: (v: string | null) => void
  disabled?: boolean
  flex?: boolean
}) {
  const isHovered = !disabled && hovered === label

  return (
    <button
      onClick={disabled ? undefined : onClick}
      onMouseEnter={() => { if (!disabled) setHovered(label) }}
      onMouseLeave={() => setHovered(null)}
      style={{
        flex: flex ? 1 : undefined,
        width: flex ? undefined : '100%',
        padding: '9px 0',
        cursor: disabled ? 'default' : 'pointer',
        fontFamily: "'Silkscreen', 'Courier New', monospace",
        fontSize: 12,
        letterSpacing: 0.5,
        color: disabled ? '#888' : '#fff',
        textShadow: disabled ? '1px 1px 0 #222' : '1px 1px 0 #373737',
        imageRendering: 'pixelated',
        outline: 'none',
        // Authentic stone button
        background: isHovered
          ? 'linear-gradient(to bottom, #8080c8 0%, #6060a8 50%, #4848a0 100%)'
          : disabled
            ? 'linear-gradient(to bottom, #5a5a5a 0%, #4a4a4a 50%, #3a3a3a 100%)'
            : 'linear-gradient(to bottom, #848484 0%, #6c6c6c 50%, #585858 100%)',
        // Classic 3D stone bevel
        border: '2px solid',
        borderTopColor:    disabled ? '#666' : isHovered ? '#aaaaee' : '#aaaaaa',
        borderLeftColor:   disabled ? '#666' : isHovered ? '#aaaaee' : '#aaaaaa',
        borderBottomColor: disabled ? '#333' : isHovered ? '#333388' : '#333333',
        borderRightColor:  disabled ? '#333' : isHovered ? '#333388' : '#333333',
      }}
    >
      {label}
    </button>
  )
}
