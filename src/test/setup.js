/* eslint-env node */
/* global globalThis, vi */
import '@testing-library/jest-dom'

// Mock IntersectionObserver
globalThis.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  observe() { return null }
  disconnect() { return null }
  unobserve() { return null }
}

// Mock ResizeObserver
globalThis.ResizeObserver = class ResizeObserver {
  constructor(cb) { this.cb = cb }
  observe() { return null }
  unobserve() { return null }
  disconnect() { return null }
}

// Mock matchMedia
Object.defineProperty(globalThis.window || globalThis, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})