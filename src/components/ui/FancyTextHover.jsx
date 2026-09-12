'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { profile } from '../../data/content'

function cn(...inputs) { return twMerge(clsx(inputs)) }

const SCATTER_TRANSFORMS = {
  1: { x: '-15%', y: '60%', rotate: 8 },
  2: { x: '-30%', y: '30%', rotate: 4 },
  3: { x: '-20%', y: '40%', rotate: -6 },
  4: { x: '0%', y: '8%', rotate: -8 },
  5: { x: '0%', y: '-20%', rotate: 5 },
  6: { x: '0%', y: '20%', rotate: -3 },
  7: { x: '0%', y: '-40%', rotate: -5 },
  8: { x: '0%', y: '15%', rotate: 10 },
  9: { x: '-10%', y: '-30%', rotate: -7 },
  10: { x: '15%', y: '25%', rotate: 6 },
  11: { x: '-25%', y: '15%', rotate: -4 },
  12: { x: '20%', y: '-15%', rotate: 8 },
  13: { x: '-15%', y: '35%', rotate: -5 },
  14: { x: '10%', y: '-25%', rotate: 7 },
  15: { x: '-5%', y: '20%', rotate: -8 },
}

const DefaultLinks = [
  { label: 'LinkedIn', href: profile.linkedin },
  { label: 'GitHub', href: profile.github },
  { label: 'Email', href: `mailto:${profile.email}` },
  { label: 'WhatsApp', href: `https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}` },
  { label: 'Instagram', href: profile.instagram },
]

export default function FancyTextHover({
  links = DefaultLinks,
  className,
}) {
  const containerRef = useRef(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const fancyEls =
        containerRef.current.querySelectorAll('.fancy-word')

      fancyEls.forEach((anchor) => {
        const text = anchor.textContent ?? ''
        anchor.textContent = ''

        text.split('').forEach((char, i) => {
          const outer = document.createElement('span')
          outer.className = 'inline-block'
          gsap.set(outer, {
            transition: 'transform 0.3s cubic-bezier(0.76, 0, 0.24, 1)',
          })

          const inner = document.createElement('span')
          inner.className = 'inline-block'

          const letter = document.createElement('span')
          letter.className = 'inline-block'
          letter.textContent = char === ' ' ? '\u00A0' : char

          inner.appendChild(letter)
          outer.appendChild(inner)
          anchor.appendChild(outer)

          const randomDelay = Math.floor(Math.random() * 5)

          const onEnter = () => {
            const childIndex = (i % 15) + 1
            const transform = SCATTER_TRANSFORMS[childIndex]
            if (transform) {
              gsap.to(outer, {
                xPercent: parseFloat(transform.x),
                yPercent: parseFloat(transform.y),
                rotation: transform.rotate,
                duration: 0.2,
                ease: 'power3.inOut',
              })
            }

            gsap.to(inner, {
              keyframes: [
                { yPercent: 0, duration: 0 },
                { yPercent: -3, duration: 2.5, ease: 'power3.inOut' },
                { yPercent: 0, duration: 2.5, ease: 'power3.inOut' },
              ],
              repeat: -1,
              delay: randomDelay,
            })
          }

          const onLeave = () => {
            gsap.killTweensOf(inner)
            gsap.to(outer, {
              xPercent: 0,
              yPercent: 0,
              rotation: 0,
              duration: 0.35,
              ease: 'power3.inOut',
            })
            gsap.to(inner, {
              yPercent: 0,
              duration: 0.35,
              ease: 'power3.inOut',
            })
          }

          anchor.addEventListener('mouseenter', onEnter)
          anchor.addEventListener('mouseleave', onLeave)
        })
      })
    },
    { scope: containerRef }
  )

  return (
    <div
      ref={containerRef}
      className={cn(
        'flex w-full flex-wrap items-center justify-start gap-8 sm:gap-12',
        className
      )}
    >
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target='_blank'
          rel='noopener noreferrer'
          className='fancy-word text-3xl font-bold uppercase no-underline text-ink transition-colors duration-250 hover:text-accent sm:text-4xl md:text-5xl tracking-wide'
        >
          {link.label}
        </a>
      ))}
    </div>
  )
}
