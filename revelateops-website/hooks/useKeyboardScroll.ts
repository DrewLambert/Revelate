'use client';

import { useEffect } from 'react';

/**
 * Hook to enable keyboard scrolling with directional keys
 * Handles: Arrow keys, Page Up/Down, Home/End, Space bar
 */
export function useKeyboardScroll() {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't interfere with typing in inputs/textareas
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      const scrollAmount = 100; // pixels per key press
      const pageScrollAmount = window.innerHeight * 0.8; // 80% of viewport

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          window.scrollBy({ top: scrollAmount, behavior: 'smooth' });
          break;

        case 'ArrowUp':
          e.preventDefault();
          window.scrollBy({ top: -scrollAmount, behavior: 'smooth' });
          break;

        case 'PageDown':
          e.preventDefault();
          window.scrollBy({ top: pageScrollAmount, behavior: 'smooth' });
          break;

        case 'PageUp':
          e.preventDefault();
          window.scrollBy({ top: -pageScrollAmount, behavior: 'smooth' });
          break;

        case 'Home':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          break;

        case 'End':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
          }
          break;

        case ' ':
          // Space bar scrolls down (Shift+Space scrolls up)
          e.preventDefault();
          const spaceScrollAmount = e.shiftKey ? -pageScrollAmount : pageScrollAmount;
          window.scrollBy({ top: spaceScrollAmount, behavior: 'smooth' });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
}
