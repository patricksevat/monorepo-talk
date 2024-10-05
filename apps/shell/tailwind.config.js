const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      __dirname,
      '{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(145, 20%, 85%)',
        input: 'hsl(145, 20%, 80%)',
        ring: 'hsl(145, 40%, 60%)',
        background: 'hsl(145, 30%, 96%)',
        foreground: 'hsl(145, 30%, 10%)',
        primary: {
          DEFAULT: 'hsl(145, 40%, 70%)',
          foreground: 'hsl(145, 40%, 10%)',
        },
        secondary: {
          DEFAULT: 'hsl(80, 40%, 80%)',
          foreground: 'hsl(80, 40%, 10%)',
        },
        destructive: {
          DEFAULT: 'hsl(0, 60%, 60%)',
          foreground: 'hsl(0, 0%, 98%)',
        },
        muted: {
          DEFAULT: 'hsl(145, 20%, 90%)',
          foreground: 'hsl(145, 20%, 40%)',
        },
        accent: {
          DEFAULT: 'hsl(25, 70%, 80%)',
          foreground: 'hsl(25, 70%, 20%)',
        },
        popover: {
          DEFAULT: 'hsl(145, 30%, 96%)',
          foreground: 'hsl(145, 30%, 10%)',
        },
        card: {
          DEFAULT: 'hsl(145, 30%, 96%)',
          foreground: 'hsl(145, 30%, 10%)',
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        sans: ['Quicksand', ...fontFamily.sans],
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
