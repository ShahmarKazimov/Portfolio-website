'use client'

import { profile } from '../../data/content'

const socialLinks = [
  {
    label: 'GitHub',
    href: profile.github,
    iconClass: 'fa-brands fa-github',
    iconChar: '\uf09b',
    typeClass: 'github',
  },
  {
    label: 'LinkedIn',
    href: profile.linkedin,
    iconClass: 'fa-brands fa-linkedin',
    iconChar: '\uf08c',
    typeClass: 'linkedin',
  },
  {
    label: 'Email',
    href: `mailto:${profile.email}`,
    iconClass: 'fa-solid fa-envelope',
    iconChar: '\uf0e0',
    typeClass: 'email',
  },
  {
    label: 'WhatsApp',
    href: `https://wa.me/${profile.phone?.replace(/[^0-9]/g, '')}`,
    iconClass: 'fa-brands fa-whatsapp',
    iconChar: '\uf232',
    typeClass: 'whatsapp',
  },
  {
    label: 'Instagram',
    href: profile.instagram,
    iconClass: 'fa-brands fa-instagram',
    iconChar: '\uf16d',
    typeClass: 'instagram',
  },
]

export default function FancyTextHover({ className }) {
  return (
    <ul className={`contact-social-list flex-wrap ${className || ''}`}>
      {socialLinks.map((item) => (
        <li key={item.label} className={`social-icon-item ${item.typeClass}`}>
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            title={item.label}
            data-icon={item.iconChar}
          >
            <i className={item.iconClass} />
          </a>
        </li>
      ))}
    </ul>
  )
}

