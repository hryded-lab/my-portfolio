'use client'

import { useState } from 'react'
import MobileAppShell from '../MobileAppShell'
import { aero as a, FONT } from '../aeroKit'

// Embeds TheSolitaire.com's shared-game player. The parameter values below were
// read off the live game rather than guessed: gameModeId 0 renders
// "Solitaire (Turn 1)", 2 renders "Triple Solitaire", 3 renders
// "Solitaire (Turn 3)". backgroundId 6 is the deep teal table, the closest of
// their backgrounds to the Aero palette.

const BASE = 'https://thesolitaire.com/shared-game/'
const BACKGROUND_ID = 6   // teal table
const CARD_SET = 0

type Level = { key: string; label: string; gameModeId: number; note: string }

const LEVELS: Level[] = [
  { key: 'easy',   label: 'Easy',   gameModeId: 0, note: 'Klondike, turn one card' },
  { key: 'medium', label: 'Medium', gameModeId: 3, note: 'Klondike, turn three cards' },
  { key: 'hard',   label: 'Hard',   gameModeId: 2, note: 'Triple Klondike, three decks' },
]

export default function SolitaireApp() {
  const [level, setLevel] = useState<Level>(LEVELS[0])
  // Bumped on every change so the iframe remounts and deals a fresh game.
  const [round, setRound] = useState(0)

  const src =
    `${BASE}?gameId=0&gameModeId=${level.gameModeId}` +
    `&backgroundId=${BACKGROUND_ID}&cardSet=${CARD_SET}`

  return (
    <MobileAppShell title="Solitaire" color="#2f7d4f" subtitle={level.note} bare>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
        {/* Difficulty */}
        <div
          style={{
            flexShrink: 0,
            display: 'flex', gap: 6, alignItems: 'center',
            padding: '10px 12px',
            background: a.bar,
            borderBottom: `1px solid ${a.border}`,
            boxShadow: `inset 0 1px 0 ${a.ridge}`,
          }}
        >
          <div
            role="tablist"
            aria-label="Difficulty"
            style={{
              display: 'inline-flex', gap: 3, padding: 3,
              borderRadius: 999,
              background: a.surfaceRaised,
              border: `1px solid ${a.border}`,
              boxShadow: a.inset,
            }}
          >
            {LEVELS.map(l => {
              const on = l.key === level.key
              return (
                <button
                  key={l.key}
                  role="tab"
                  type="button"
                  aria-selected={on}
                  onClick={() => { setLevel(l); setRound(r => r + 1) }}
                  style={{
                    minHeight: 34, padding: '6px 16px',
                    border: 'none', borderRadius: 999, cursor: 'pointer',
                    fontFamily: FONT, fontSize: 13, fontWeight: on ? 600 : 500,
                    color: on ? '#fff' : a.textDim,
                    background: on
                      ? 'linear-gradient(180deg, #6fa8d8 0%, #4d86b8 48%, #3f74a4 52%, #6098c8 100%)'
                      : 'transparent',
                    boxShadow: on
                      ? 'inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 3px rgba(20,60,95,0.28)'
                      : 'none',
                    textShadow: on ? '0 1px 1px rgba(10,40,66,0.4)' : 'none',
                  }}
                >
                  {l.label}
                </button>
              )
            })}
          </div>

          <div style={{ flex: 1 }} />

          <button
            type="button"
            onClick={() => setRound(r => r + 1)}
            style={{
              minHeight: 34, padding: '6px 14px',
              borderRadius: 999,
              border: `1px solid ${a.border}`,
              background: a.bar,
              color: a.text,
              fontFamily: FONT, fontSize: 13,
              cursor: 'pointer',
              boxShadow: `inset 0 1px 0 ${a.ridge}, 0 1px 2px rgba(20,60,95,0.14)`,
            }}
          >
            New deal
          </button>
        </div>

        {/* Game */}
        <div style={{ flex: 1, minHeight: 0, background: '#16323c' }}>
          <iframe
            key={`${level.key}-${round}`}
            src={src}
            title={`Solitaire, ${level.label}`}
            allow="autoplay; fullscreen"
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
          />
        </div>
      </div>
    </MobileAppShell>
  )
}
