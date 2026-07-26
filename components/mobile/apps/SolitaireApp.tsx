'use client'

import { useCallback, useMemo, useState } from 'react'
import MobileAppShell from '../MobileAppShell'
import { aero as a, FONT } from '../aeroKit'

// Klondike solitaire. Tap-to-move rather than drag: on a phone, dragging a card
// across seven columns fights the scroll gesture and misses constantly. Tap a
// card to pick up, tap a destination to drop, tap the same card again to cancel.

const SUITS = ['S', 'H', 'D', 'C'] as const
type Suit = typeof SUITS[number]
type Card = { id: string; suit: Suit; rank: number; faceUp: boolean }

const RED: Suit[] = ['H', 'D']
const PIP: Record<Suit, string> = { S: '♠', H: '♥', D: '♦', C: '♣' }
const RANKS = ['', 'A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K']

const isRed = (s: Suit) => RED.includes(s)

type Pile = { kind: 'tableau' | 'foundation' | 'waste' | 'stock'; index: number }
type Sel = { pile: Pile; cardIndex: number } | null

type Game = {
  stock: Card[]
  waste: Card[]
  foundations: Card[][]
  tableau: Card[][]
  moves: number
}

function freshDeck(): Card[] {
  const deck: Card[] = []
  for (const suit of SUITS) {
    for (let rank = 1; rank <= 13; rank++) {
      deck.push({ id: `${suit}${rank}`, suit, rank, faceUp: false })
    }
  }
  // Fisher-Yates
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[deck[i], deck[j]] = [deck[j], deck[i]]
  }
  return deck
}

function deal(): Game {
  const deck = freshDeck()
  const tableau: Card[][] = Array.from({ length: 7 }, () => [])
  for (let col = 0; col < 7; col++) {
    for (let n = 0; n <= col; n++) {
      const card = deck.pop()!
      card.faceUp = n === col
      tableau[col].push(card)
    }
  }
  return { stock: deck, waste: [], foundations: [[], [], [], []], tableau, moves: 0 }
}

// A tableau run must alternate colour and descend by one.
function stacksOnTableau(moving: Card, onto: Card | undefined): boolean {
  if (!onto) return moving.rank === 13
  return onto.faceUp && isRed(onto.suit) !== isRed(moving.suit) && onto.rank === moving.rank + 1
}

function stacksOnFoundation(moving: Card, pile: Card[]): boolean {
  if (pile.length === 0) return moving.rank === 1
  const top = pile[pile.length - 1]
  return top.suit === moving.suit && top.rank === moving.rank - 1
}

export default function SolitaireApp() {
  const [game, setGame] = useState<Game>(() => deal())
  const [sel, setSel] = useState<Sel>(null)

  const won = useMemo(
    () => game.foundations.every(f => f.length === 13),
    [game.foundations],
  )

  const reset = useCallback(() => { setGame(deal()); setSel(null) }, [])

  const drawFromStock = useCallback(() => {
    setSel(null)
    setGame(g => {
      if (g.stock.length === 0) {
        // Recycle the waste back into the stock, face down, order preserved.
        if (g.waste.length === 0) return g
        return {
          ...g,
          stock: [...g.waste].reverse().map(c => ({ ...c, faceUp: false })),
          waste: [],
          moves: g.moves + 1,
        }
      }
      const stock = [...g.stock]
      const card = stock.pop()!
      return { ...g, stock, waste: [...g.waste, { ...card, faceUp: true }], moves: g.moves + 1 }
    })
  }, [])

  // Cards being carried: a tableau selection takes the whole run beneath it.
  const carried = useCallback((g: Game, s: Exclude<Sel, null>): Card[] => {
    if (s.pile.kind === 'tableau') return g.tableau[s.pile.index].slice(s.cardIndex)
    if (s.pile.kind === 'waste') return g.waste.slice(-1)
    if (s.pile.kind === 'foundation') return g.foundations[s.pile.index].slice(-1)
    return []
  }, [])

  const removeCarried = (g: Game, s: Exclude<Sel, null>): Game => {
    if (s.pile.kind === 'tableau') {
      const tableau = g.tableau.map((col, i) =>
        i === s.pile.index ? col.slice(0, s.cardIndex) : col)
      // Expose whatever the run was sitting on.
      const col = tableau[s.pile.index]
      if (col.length && !col[col.length - 1].faceUp) {
        col[col.length - 1] = { ...col[col.length - 1], faceUp: true }
      }
      return { ...g, tableau }
    }
    if (s.pile.kind === 'waste') return { ...g, waste: g.waste.slice(0, -1) }
    if (s.pile.kind === 'foundation') {
      const foundations = g.foundations.map((f, i) =>
        i === s.pile.index ? f.slice(0, -1) : f)
      return { ...g, foundations }
    }
    return g
  }

  const tryDrop = useCallback((dest: Pile) => {
    if (!sel) return
    setGame(g => {
      const cards = carried(g, sel)
      if (cards.length === 0) return g

      if (dest.kind === 'foundation') {
        if (cards.length !== 1 || !stacksOnFoundation(cards[0], g.foundations[dest.index])) return g
        const next = removeCarried(g, sel)
        const foundations = next.foundations.map((f, i) =>
          i === dest.index ? [...f, cards[0]] : f)
        return { ...next, foundations, moves: next.moves + 1 }
      }

      if (dest.kind === 'tableau') {
        const col = g.tableau[dest.index]
        if (!stacksOnTableau(cards[0], col[col.length - 1])) return g
        const next = removeCarried(g, sel)
        const tableau = next.tableau.map((c, i) =>
          i === dest.index ? [...c, ...cards] : c)
        return { ...next, tableau, moves: next.moves + 1 }
      }

      return g
    })
    setSel(null)
  }, [sel, carried])

  // Double-tap sends a card straight to its foundation if it will go.
  const sendToFoundation = useCallback((pile: Pile, cardIndex: number) => {
    setGame(g => {
      const source: Sel = { pile, cardIndex }
      const cards = carried(g, source)
      if (cards.length !== 1) return g
      const target = g.foundations.findIndex(f => stacksOnFoundation(cards[0], f))
      if (target === -1) return g
      const next = removeCarried(g, source)
      const foundations = next.foundations.map((f, i) =>
        i === target ? [...f, cards[0]] : f)
      return { ...next, foundations, moves: next.moves + 1 }
    })
    setSel(null)
  }, [carried])

  const tapCard = (pile: Pile, cardIndex: number, card: Card) => {
    if (!card.faceUp) return
    if (sel && sel.pile.kind === pile.kind && sel.pile.index === pile.index && sel.cardIndex === cardIndex) {
      setSel(null)
      return
    }
    if (sel) { tryDrop(pile); return }
    setSel({ pile, cardIndex })
  }

  const isSelected = (pile: Pile, cardIndex: number) =>
    !!sel && sel.pile.kind === pile.kind && sel.pile.index === pile.index && sel.cardIndex <= cardIndex

  return (
    <MobileAppShell
      title="Solitaire"
      color="#2f7d4f"
      subtitle={won ? 'Solved' : `${game.moves} moves`}
      trailing={
        <button
          type="button"
          onClick={reset}
          style={{
            padding: '6px 14px', borderRadius: 999, minHeight: 32,
            border: '1px solid rgba(255,255,255,0.5)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.28), rgba(255,255,255,0.10))',
            color: '#fff', fontFamily: FONT, fontSize: 12.5, fontWeight: 550,
          }}
        >
          New game
        </button>
      }
      bare
    >
      <div
        style={{
          position: 'absolute', inset: 0,
          overflowY: 'auto',
          // Felt table, but Aero felt: a lit green baize rather than flat #008000.
          background:
            'radial-gradient(130% 90% at 50% 0%, #4f9d6d 0%, #2f7d4f 42%, #1d5c39 100%)',
          padding: '12px 10px 28px',
        }}
      >
        {won && (
          <div
            style={{
              margin: '0 2px 12px', padding: '12px 14px', borderRadius: 12,
              background: 'linear-gradient(180deg, rgba(255,255,255,0.30), rgba(255,255,255,0.12))',
              border: '1px solid rgba(255,255,255,0.55)',
              color: '#fff', fontFamily: FONT, fontSize: 14, fontWeight: 600,
              textShadow: '0 1px 2px rgba(0,50,25,0.4)',
            }}
          >
            Solved in {game.moves} moves.
          </div>
        )}

        {/* Top row: stock, waste, four foundations */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          <Slot onClick={drawFromStock} label={game.stock.length ? undefined : '↺'}>
            {game.stock.length > 0 && <CardBack />}
          </Slot>

          <Slot
            onClick={() => {
              if (!game.waste.length) return
              const idx = game.waste.length - 1
              tapCard({ kind: 'waste', index: 0 }, idx, game.waste[idx])
            }}
            onDoubleClick={() => {
              if (!game.waste.length) return
              sendToFoundation({ kind: 'waste', index: 0 }, game.waste.length - 1)
            }}
          >
            {game.waste.length > 0 && (
              <CardFace
                card={game.waste[game.waste.length - 1]}
                selected={isSelected({ kind: 'waste', index: 0 }, game.waste.length - 1)}
              />
            )}
          </Slot>

          <div style={{ flex: 1 }} />

          {game.foundations.map((f, i) => (
            <Slot
              key={i}
              onClick={() => (sel ? tryDrop({ kind: 'foundation', index: i }) : undefined)}
              label={f.length ? undefined : PIP[SUITS[i]]}
            >
              {f.length > 0 && <CardFace card={f[f.length - 1]} />}
            </Slot>
          ))}
        </div>

        {/* Seven tableau columns */}
        <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
          {game.tableau.map((col, ci) => (
            <div
              key={ci}
              onClick={() => { if (sel && col.length === 0) tryDrop({ kind: 'tableau', index: ci }) }}
              style={{
                flex: 1, minWidth: 0,
                minHeight: 96,
                borderRadius: 6,
                border: col.length === 0 ? '1px dashed rgba(255,255,255,0.32)' : 'none',
                position: 'relative',
              }}
            >
              {col.map((card, ri) => (
                <div
                  key={card.id}
                  onClick={e => { e.stopPropagation(); tapCard({ kind: 'tableau', index: ci }, ri, card) }}
                  onDoubleClick={e => {
                    e.stopPropagation()
                    if (ri === col.length - 1) sendToFoundation({ kind: 'tableau', index: ci }, ri)
                  }}
                  style={{ marginTop: ri === 0 ? 0 : -46 }}
                >
                  {card.faceUp
                    ? <CardFace card={card} selected={isSelected({ kind: 'tableau', index: ci }, ri)} />
                    : <CardBack />}
                </div>
              ))}
            </div>
          ))}
        </div>

        <p
          style={{
            marginTop: 18, textAlign: 'center',
            fontFamily: FONT, fontSize: 12,
            color: 'rgba(255,255,255,0.72)',
            textShadow: '0 1px 2px rgba(0,50,25,0.35)',
          }}
        >
          Tap a card, then tap where it goes. Double tap to send it home.
        </p>
      </div>
    </MobileAppShell>
  )
}

// ── Card rendering ────────────────────────────────────────────────────────────

const CARD_STYLE: React.CSSProperties = {
  width: '100%',
  aspectRatio: '5 / 7',
  borderRadius: 6,
  boxSizing: 'border-box',
  position: 'relative',
  userSelect: 'none',
}

function CardFace({ card, selected }: { card: Card; selected?: boolean }) {
  const red = isRed(card.suit)
  return (
    <div
      style={{
        ...CARD_STYLE,
        background: 'linear-gradient(160deg, #ffffff 0%, #f2f6fa 62%, #e6edf4 100%)',
        border: `1px solid ${selected ? '#ffd45e' : 'rgba(70,110,145,0.5)'}`,
        boxShadow: selected
          ? '0 0 0 2px #ffd45e, 0 3px 8px rgba(0,40,20,0.4)'
          : 'inset 0 1px 0 #fff, 0 1px 3px rgba(0,40,20,0.34)',
        padding: '3px 4px',
        display: 'flex', flexDirection: 'column', alignItems: 'flex-start',
        color: red ? '#c8352b' : '#1d2530',
        fontFamily: FONT,
        lineHeight: 1,
        overflow: 'hidden',
      }}
    >
      <span style={{ fontSize: 12, fontWeight: 700 }}>{RANKS[card.rank]}</span>
      <span style={{ fontSize: 11, marginTop: 1 }}>{PIP[card.suit]}</span>
    </div>
  )
}

function CardBack() {
  return (
    <div
      style={{
        ...CARD_STYLE,
        // Glossy Aero back rather than the usual crosshatch.
        background:
          'linear-gradient(160deg, #6fb2e8 0%, #3d7fc0 48%, #2b5f96 100%)',
        border: '1px solid rgba(255,255,255,0.45)',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 3px rgba(0,40,20,0.34)',
        overflow: 'hidden',
      }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute', left: 0, right: 0, top: 0, height: '52%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0))',
        }}
      />
    </div>
  )
}

function Slot({
  children, onClick, onDoubleClick, label,
}: {
  children?: React.ReactNode
  onClick?: () => void
  onDoubleClick?: () => void
  label?: string
}) {
  return (
    <div
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{
        flex: '0 0 13%',
        minWidth: 0,
        borderRadius: 6,
        border: children ? 'none' : '1px dashed rgba(255,255,255,0.34)',
        aspectRatio: '5 / 7',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'rgba(255,255,255,0.55)',
        fontSize: 15,
      }}
    >
      {children ?? label ?? null}
    </div>
  )
}
