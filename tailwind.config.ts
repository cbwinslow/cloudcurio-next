import type { Config } from 'tailwindcss'
export default {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx}','./components/**/*.{ts,tsx}','./content/**/*.mdx'],
  theme: {
    extend: {
      colors: {
        cloudcurio: {
          bg: '#07090a', surface: '#0b1114',
          neon: '#18ff9b', mint: '#5fffe7', lime: '#b8ff2c'
        }
      },
      boxShadow: { glow: '0 0 30px rgba(24,255,155,0.35)' }
    }
  },
  plugins: [require('@tailwindcss/typography')]
} satisfies Config
