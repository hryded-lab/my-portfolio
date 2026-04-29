'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Github, Linkedin, Mail, Heart } from 'lucide-react'
import { siteConfig } from '@/content/siteConfig'

const KONAMI_CODE = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']

export default function Footer() {
  const [konamiStep, setKonamiStep] = useState(0)
  const [easterEgg, setEasterEgg] = useState(false)

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === KONAMI_CODE[konamiStep]) {
        const next = konamiStep + 1
        if (next === KONAMI_CODE.length) {
          setEasterEgg(true)
          setKonamiStep(0)
          setTimeout(() => setEasterEgg(false), 4000)
        } else {
          setKonamiStep(next)
        }
      } else {
        setKonamiStep(0)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [konamiStep])

  const navLinks = [
    { label: 'About', href: '#about' },
    { label: 'Skills', href: '#skills' },
    { label: 'Projects', href: '#projects' },
    { label: 'Experience', href: '#experience' },
    { label: 'Blog', href: '#blog' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      {/* Easter Egg */}
      <AnimatePresence>
        {easterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 40 }}
            className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 glass rounded-2xl px-8 py-6 text-center border border-amber-400/30"
          >
            <div className="text-3xl mb-2">🎮</div>
            <p className="text-amber-400 font-bold">Konami Code Activated!</p>
            <p className="text-white/50 text-sm mt-1">You found the easter egg. You&rsquo;re a legend.</p>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Brand */}
            <div className="text-center md:text-left">
              <a href="#" className="text-xl font-bold text-white">
                HL<span className="text-amber-400">.</span>
              </a>
              <p className="text-white/30 text-sm mt-1">
                Built by{' '}
                <span className="text-amber-400">Hryday</span> with{' '}
                <Heart size={12} className="inline text-red-400 mx-1" />
                using Next.js & Framer Motion
              </p>
            </div>

            {/* Nav */}
            <nav className="flex flex-wrap justify-center gap-6">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/40 hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            {/* Social */}
            <div className="flex gap-4">
              {[
                { icon: Github, href: siteConfig.github, label: 'GitHub' },
                { icon: Linkedin, href: siteConfig.linkedin, label: 'LinkedIn' },
                { icon: Mail, href: `mailto:${siteConfig.email}`, label: 'Email' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={label !== 'Email' ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 glass rounded-lg flex items-center justify-center text-white/40 hover:text-amber-400 transition-colors"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-white/20 text-xs">
              © {new Date().getFullYear()} Hryday Nitin Lath · Tip: Try the Konami Code ↑↑↓↓←→←→BA
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}
