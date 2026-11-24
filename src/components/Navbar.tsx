import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { TRANSLATIONS, type Lang } from '../data/i18n';

interface NavbarProps {
  lang: Lang;
  onOpenPlatform: () => void;
  isWorkspaceExpanded: boolean;
}

export function Navbar({ lang, onOpenPlatform, isWorkspaceExpanded }: NavbarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const t = TRANSLATIONS[lang].nav;

  const navLinks = [
    { label: t.monitoring, href: '#interactive-platform' },
    { label: t.capabilities, href: '#capabilities' },
    { label: t.outcomes, href: '#outcomes' },
    { label: t.pricing, href: '#pricing' },
  ];

  const handleNavClick = () => {
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F8FAF8]/95 backdrop-blur-md border-b border-[#E2E8E4]">
      <div className="max-w-[1240px] mx-auto px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-element Brand Wordmark */}
        <a
          href="#"
          className="font-display text-lg font-bold tracking-tight text-[#0F1F18] whitespace-nowrap shrink-0 flex items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D9F58]"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
            className="shrink-0"
          >
            <rect x="2" y="2" width="20" height="20" rx="5" fill="#0B1F17" />
            <path d="M6 15.5L11.5 7.5L18 11.5L13.5 17.5H6V15.5Z" fill="#10B981" />
            <path d="M11.5 7.5L18 11.5L15 6.5L11.5 7.5Z" fill="#84CC16" />
          </svg>
          <span>AgriOS</span>
        </a>

        {/* Zone 2: 4 concise single-line text nav links */}
        <nav
          aria-label="Primary Navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#475950]"
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="hover:text-[#0F1F18] hover:underline underline-offset-4 decoration-[#0D9F58] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0D9F58]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Zone 3: 1 Primary Action Button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onOpenPlatform}
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-semibold text-white bg-[#0B1F17] hover:bg-[#0D9F58] rounded-lg transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0D9F58]"
          >
            {isWorkspaceExpanded ? t.closePlatform : t.openPlatform}
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden p-2 rounded-lg text-[#0F1F18] hover:bg-[#E2E8E4]/60 transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-[#E2E8E4] bg-[#F8FAF8] px-6 py-4 flex flex-col gap-3">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={handleNavClick}
              className="py-2 text-sm font-medium text-[#0F1F18] border-b border-[#E2E8E4]/60 last:border-b-0"
            >
              {link.label}
            </a>
          ))}
          <button
            type="button"
            onClick={() => {
              setMobileOpen(false);
              onOpenPlatform();
            }}
            className="mt-1 w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#0B1F17] hover:bg-[#0D9F58] rounded-lg transition-colors cursor-pointer"
          >
            {isWorkspaceExpanded ? t.closePlatform : t.openPlatform}
          </button>
        </div>
      )}
    </header>
  );
}
