/** @type {import('tailwindcss').Config} */
import pluginAnimate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      backgroundImage: {
        'edu-land-background': `url('/images/edu-land-background.svg')`,
        'edu-faucet-background': `url('/images/edu-faucet-background.svg')`,
        'bridge-background': `url('/images/bridge-background.svg')`
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      colors: {
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
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))'
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
        },
        black: 'hsl(var(--black))',
        white: 'hsl(var(--white))',
        beige: 'hsl(var(--beige))',
        grass: 'hsl(var(--grass))',
        green: 'hsl(var(--green))',
        'green-light': 'hsl(var(--green-light))',
        'green-muted': 'hsl(var(--green-muted))',
        'green-toxic': 'hsl(var(--green-toxic))',
        orange: 'hsl(var(--orange))',
        yellow: 'hsl(var(--yellow))',
        gray: 'hsla(var(--gray))',
        'gray-light': 'hsla(var(--gray-light))'
      },
      boxShadow: {
        'border-box': '0 4px 0 0 black'
      },
      spacing: {
        'border-box-sm': '16px 24px',
        'border-box': '24px 40px',
        '5px': '5px',
        '10px': '10px'
      }
    }
  },
  plugins: [pluginAnimate]
}
