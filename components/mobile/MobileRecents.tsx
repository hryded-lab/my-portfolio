'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { getApp, type AppId } from './mobileApps'
import { mobileTheme as t } from './mobileTheme'

type Props = {
  openApps: AppId[]
  onClose: (id: AppId) => void
  onResume: (id: AppId) => void
  onDismiss: () => void
  onClearAll: () => void
}

export default function MobileRecents({ openApps, onClose, onResume, onDismiss, onClearAll }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0, left: 0, right: 0,
        bottom: `calc(${t.navHeight}px + env(safe-area-inset-bottom, 0px))`,
        background: 'rgba(4, 10, 26, 0.85)',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        zIndex: 70,
        display: 'flex', flexDirection: 'column',
        fontFamily: t.fontUi,
      }}
      onClick={onDismiss}
    >
      <div
        style={{
          padding: 'calc(env(safe-area-inset-top, 0px) + 18px) 20px 6px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ fontSize: 12, color: t.textMuted, textTransform: 'uppercase', letterSpacing: 1.4, fontWeight: 700 }}>
          Recent apps
        </div>
        {openApps.length > 0 && (
          <button
            onClick={onClearAll}
            style={{
              background: 'rgba(255,255,255,0.08)',
              border: `1px solid ${t.border}`,
              borderRadius: 999,
              color: t.textSec,
              fontSize: 11, fontWeight: 600,
              padding: '6px 12px',
              cursor: 'pointer',
              fontFamily: 'inherit',
              WebkitTapHighlightColor: 'transparent',
            }}
          >
            Clear all
          </button>
        )}
      </div>

      <div
        style={{
          flex: 1,
          overflowX: 'auto', overflowY: 'hidden',
          display: 'flex', alignItems: 'center', gap: 14,
          padding: '12px 24px 20px',
          scrollSnapType: 'x mandatory',
        }}
        onClick={e => e.stopPropagation()}
      >
        {openApps.length === 0 ? (
          <div
            style={{
              flex: 1, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              color: t.textMuted, fontSize: 13,
              padding: '40px 0',
              textAlign: 'center',
              width: '100%',
            }}
          >
            No recent apps
          </div>
        ) : (
          <AnimatePresence mode="popLayout">
            {openApps.map(id => (
              <RecentCard
                key={id}
                id={id}
                onTap={() => onResume(id)}
                onSwipeOff={() => onClose(id)}
              />
            ))}
          </AnimatePresence>
        )}
      </div>
    </motion.div>
  )
}

function RecentCard({
  id, onTap, onSwipeOff,
}: {
  id: AppId
  onTap: () => void
  onSwipeOff: () => void
}) {
  const app = getApp(id)
  return (
    <motion.div
      layout
      drag="y"
      dragConstraints={{ top: -400, bottom: 0 }}
      dragElastic={0.18}
      onDragEnd={(_, info) => {
        if (info.offset.y < -120 || info.velocity.y < -350) onSwipeOff()
      }}
      onClick={onTap}
      initial={{ scale: 0.94, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ x: 0, y: -300, opacity: 0, transition: { duration: 0.22 } }}
      transition={{ type: 'spring', stiffness: 300, damping: 28 }}
      whileTap={{ scale: 0.97 }}
      style={{
        flexShrink: 0,
        width: '74%',
        height: '78%',
        maxWidth: 320,
        borderRadius: 22,
        background: app.color,
        scrollSnapAlign: 'center',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: `0 12px 32px ${app.color}55, 0 4px 12px rgba(0,0,0,0.35)`,
        WebkitTapHighlightColor: 'transparent',
        touchAction: 'none',
      }}
    >
      {/* Header gloss */}
      <div
        style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
          background: 'linear-gradient(180deg, rgba(255,255,255,0.18), transparent)',
          pointerEvents: 'none',
        }}
      />

      <div
        style={{
          padding: '20px 22px',
          color: '#fff',
        }}
      >
        <div style={{ fontSize: 11, fontWeight: 700, opacity: 0.85, letterSpacing: 1.2, textTransform: 'uppercase' }}>
          Open
        </div>
        <div style={{ fontSize: 26, fontWeight: 700, marginTop: 4, letterSpacing: -0.5, lineHeight: 1.15 }}>
          {app.label}
        </div>
      </div>

      <div
        style={{
          position: 'absolute',
          bottom: 22, left: 22, right: 22,
          fontSize: 11, color: 'rgba(255,255,255,0.85)',
          letterSpacing: 0.4,
        }}
      >
        Swipe up to close · tap to resume
      </div>
    </motion.div>
  )
}
