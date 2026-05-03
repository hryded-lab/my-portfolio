'use client'

import { useState } from 'react'
import MobileAppShell from '../MobileAppShell'

const COLOR = '#8dc962'

export default function MinecraftApp() {
  const [hovered, setHovered] = useState<string | null>(null)

  return (
    <MobileAppShell title="Minecraft" color={COLOR} subtitle="Replica · Java menu" bare>
      <div
        style={{
          position: 'relative',
          width: '100%', height: '100%',
          overflow: 'hidden',
          fontFamily: "'Silkscreen', 'Courier New', monospace",
          imageRendering: 'pixelated',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {/* Background — same asset as desktop replica */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/minecraft-bg.jpg"
          alt=""
          draggable={false}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%',
            objectFit: 'cover',
            userSelect: 'none', pointerEvents: 'none',
          }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.36)' }} />

        {/* Buttons — title is in the background image */}
        <div
          style={{
            position: 'relative', zIndex: 1,
            display: 'flex', flexDirection: 'column', gap: 6,
            width: '78%', maxWidth: 320,
          }}
        >
          <MCButton
            label="Singleplayer"
            hovered={hovered} setHovered={setHovered}
            onClick={() => window.open('https://classic.minecraft.net', '_blank')}
          />
          <MCButton label="Multiplayer" hovered={hovered} setHovered={setHovered} disabled />
          <MCButton label="Mods & Textures" hovered={hovered} setHovered={setHovered} disabled />
          <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
            <MCButton label="Options..." hovered={hovered} setHovered={setHovered} disabled flex />
            <MCButton label="Quit"        hovered={hovered} setHovered={setHovered} disabled flex />
          </div>
        </div>

        {/* Copyright */}
        <div
          style={{
            position: 'absolute', bottom: 10, left: 12, zIndex: 2,
            fontSize: 9, color: 'rgba(255,255,255,0.45)',
            textShadow: '1px 1px 0 #000', userSelect: 'none',
          }}
        >
          Copyright Mojang AB. Do not distribute!
        </div>
        <div
          style={{
            position: 'absolute', bottom: 10, right: 12, zIndex: 2,
            fontSize: 9, color: 'rgba(255,255,255,0.55)',
            textShadow: '1px 1px 0 #000',
          }}
        >
          1.0
        </div>
      </div>
    </MobileAppShell>
  )
}

function MCButton({
  label, onClick, hovered, setHovered, disabled, flex,
}: {
  label: string
  onClick?: () => void
  hovered: string | null
  setHovered: (v: string | null) => void
  disabled?: boolean
  flex?: boolean
}) {
  const isHovered = hovered === label && !disabled
  return (
    <button
      onClick={disabled ? undefined : onClick}
      onPointerEnter={() => !disabled && setHovered(label)}
      onPointerLeave={() => setHovered(null)}
      disabled={disabled}
      style={{
        flex: flex ? 1 : undefined,
        width: flex ? undefined : '100%',
        padding: '10px 14px',
        background: disabled
          ? 'linear-gradient(to bottom, #555 0%, #444 100%)'
          : isHovered
            ? 'linear-gradient(to bottom, #9d9d9d 0%, #6e6e6e 100%)'
            : 'linear-gradient(to bottom, #828282 0%, #5a5a5a 100%)',
        border: '2px solid #1d1d1d',
        boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.25), inset -1px -1px 0 rgba(0,0,0,0.4)',
        color: disabled ? 'rgba(255,255,255,0.45)' : '#fff',
        fontFamily: "'Silkscreen', 'Courier New', monospace",
        fontSize: 13,
        letterSpacing: 1.2,
        cursor: disabled ? 'default' : 'pointer',
        textShadow: '1px 1px 0 #1d1d1d',
        WebkitTapHighlightColor: 'transparent',
        imageRendering: 'pixelated',
      }}
    >
      {label}
    </button>
  )
}
