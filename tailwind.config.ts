import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        fraunces: ['var(--font-fraunces)', 'serif'],
        inter:    ['var(--font-inter)', 'sans-serif'],
      },
      colors: {
        cream:        '#F5EFE6',
        brown:        '#7A5C45',
        'dark-blue':  '#1F3A5F',
        beige:        '#E8DFD1',
        tan:          '#C8A98D',
        'muted-blue': '#4A6A8A',
        'dark-brown': '#4B372A',
        'soft-tan':   '#D8CFC0',
      },
    },
  },
  plugins: [],
}

export default config
