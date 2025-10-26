'use client';
import { useEffect, useState, useRef, useMemo } from 'react';
import { useAppSelector, useAppDispatch } from '~/store/hooks';
import { setActiveIndex, nextPage } from '~/store/navigationSlice';
import { RootState } from '~/store/store';

export default function Header() {
  const dispatch = useAppDispatch();
  const activeIndex = useAppSelector((state: RootState) => state.navigation.activeIndex);

  const navigationLinks = useMemo(
    () => [
      { id: 0, href: '/', label: 'Home' },
      { id: 1, href: '/attendance', label: 'Attendance' },
      { id: 2, href: '/trend', label: 'Trend' },
      { id: 3, href: '/services', label: 'Services' },
      { id: 4, href: '/dashboard', label: 'Dashboard' },
    ],
    [],
  );

  return (
    <header className="absolute top-4 left-1/2 -translate-x-1/2 z-50 w-fit rounded-full hover:px-2 hover:py-1 transition-all duration-300 bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl">
      <div className="max-w-7xl mx-auto flex items-center justify-center">
        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-0">
          {navigationLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => dispatch(setActiveIndex(link.id))}
              className="relative text-sm font-medium text-white/90 px-6 hover:scale-120 py-4 hover:text-white transition-all duration-300 group"
            >
              {link.label}
              <span
                className={`absolute left-0 top-0 bg-white/10 h-full w-full rounded-full transition-transform duration-300 ${
                  activeIndex === link.id ? 'opacity-100 ' : 'opacity-0'
                } group-hover:opacity-100`}
              ></span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
