'use client';

import { useKeyboardScroll } from '@/hooks/useKeyboardScroll';

/**
 * Client component wrapper to enable keyboard scrolling globally
 */
export default function KeyboardScrollProvider() {
  useKeyboardScroll();
  return null;
}
