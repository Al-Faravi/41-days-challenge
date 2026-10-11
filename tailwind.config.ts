import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        challenge: {
          navy: '#0A2947',   // Deep Blue (Background)
          cream: '#F3E4C9',  // Cream (Primary Text)
          sage: '#D3D4C0',   // Light Gray/Greenish (Secondary Text)
          brown: '#8B5E3C',  // Brown (Accents/Borders)
          black: '#000000',  // Pure Black for contrast
        }
      },
    },
  },
  plugins: [],
}
export default config;