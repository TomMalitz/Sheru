import { defineConfig } from 'vite-plugin-windicss'
import typography from 'windicss/plugin/typography'

export default defineConfig({
  darkMode: 'class',
  plugins: [typography()],
  theme: {
    fontFamily: {
      sans: ['Open Sans', 'ui-sans-serif', 'system-ui'],
      serif: ['Montserrat', 'ui-serif', 'Georgia'],
      mono: ['Fira Sans', 'ui-monospace', 'SFMono-Regular'],
    },
    extend: {
      colors: {
        primary: '#FFFFFF',
        secondary: '#0077CC',
        accent: '#F0F0F0',
        info: '#737373',
        success: '#1B8751',
        warning: '#F6BC32',
        error: '#C74F44',
      },
    },
  },
})
