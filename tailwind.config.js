const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // Force light theme always
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--theme-color-50)',
          100: 'var(--theme-color-100)',
          200: 'var(--theme-color-200)',
          300: 'var(--theme-color-300)',
          400: 'var(--theme-color-400)',
          500: 'var(--theme-color-500)',
          600: 'var(--theme-color-600)',
          700: 'var(--theme-color-700)',
          800: 'var(--theme-color-800)',
          900: 'var(--theme-color-900)',
          950: 'var(--theme-color-950)'
        }
      },
      fontFamily: {
        sans: ['var(--font-inter)'],
        'theme-en': ['var(--theme-font-en)'],
        'theme-ar': ['var(--theme-font-ar)']
      },
      borderRadius: {
        theme: 'var(--theme-border-radius)'
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 }
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' }
        },
        blink: {
          '0%': { opacity: 0.2 },
          '20%': { opacity: 1 },
          '100% ': { opacity: 0.2 }
        }
      },
      animation: {
        fadeIn: 'fadeIn .3s ease-in-out',
        carousel: 'marquee 60s linear infinite',
        blink: 'blink 1.4s both infinite'
      }
    }
  },
  future: {
    hoverOnlyWhenSupported: true
  },
  plugins: [
    require('@tailwindcss/container-queries'),
    require('@tailwindcss/typography'),
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        {
          'animation-delay': (value) => {
            return {
              'animation-delay': value
            };
          }
        },
        {
          values: theme('transitionDelay')
        }
      );
    })
  ]
};
