const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', 'class'], // Use class-based dark mode (but we won't add the 'dark' class)
  theme: {
  	extend: {
  		colors: {
  			primary: {
  				'50': 'var(--theme-color-50)',
  				'100': 'var(--theme-color-100)',
  				'200': 'var(--theme-color-200)',
  				'300': 'var(--theme-color-300)',
  				'400': 'var(--theme-color-400)',
  				'500': 'var(--theme-color-500)',
  				'600': 'var(--theme-color-600)',
  				'700': 'var(--theme-color-700)',
  				'800': 'var(--theme-color-800)',
  				'900': 'var(--theme-color-900)',
  				'950': 'var(--theme-color-950)',
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-inter)'
  			],
  			'theme-en': [
  				'var(--theme-font-en)'
  			],
  			'theme-ar': [
  				'var(--theme-font-ar)'
  			]
  		},
  		borderRadius: {
  			theme: 'var(--theme-border-radius)',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			fadeIn: {
  				from: {
  					opacity: 0
  				},
  				to: {
  					opacity: 1
  				}
  			},
  			marquee: {
  				'0%': {
  					transform: 'translateX(0%)'
  				},
  				'100%': {
  					transform: 'translateX(-100%)'
  				}
  			},
  			blink: {
  				'0%': {
  					opacity: 0.2
  				},
  				'20%': {
  					opacity: 1
  				},
  				'100% ': {
  					opacity: 0.2
  				}
  			},
  			sweep: {
  				'0%': {
  					'--pie-progress': '0%',
  					opacity: 0
  				},
  				'50%': {
  					'--pie-progress': '50%',
  					opacity: 0.5
  				},
  				'100%': {
  					'--pie-progress': '100%',
  					opacity: 0
  				}
  			}
  		},
  		animation: {
  			fadeIn: 'fadeIn .3s ease-in-out',
  			carousel: 'marquee 60s linear infinite',
  			blink: 'blink 1.4s both infinite',
  			sweep: 'sweep 10s linear infinite'
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
    }),
      require("tailwindcss-animate")
]
};
