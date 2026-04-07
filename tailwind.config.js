/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  safelist: [
    "text-orange-500", "bg-orange-100", "border-orange-200",
  ],
  theme: {
    extend: {
      fontFamily: {
        jakarta: ['var(--font-jakarta)'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 4px)',
        sm: 'calc(var(--radius) - 8px)',
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: { DEFAULT: 'hsl(var(--card))', foreground: 'hsl(var(--card-foreground))' },
        popover: { DEFAULT: 'hsl(var(--popover))', foreground: 'hsl(var(--popover-foreground))' },
        primary: { DEFAULT: 'hsl(var(--primary))', foreground: 'hsl(var(--primary-foreground))' },
        secondary: { DEFAULT: 'hsl(var(--secondary))', foreground: 'hsl(var(--secondary-foreground))' },
        muted: { DEFAULT: 'hsl(var(--muted))', foreground: 'hsl(var(--muted-foreground))' },
        accent: { DEFAULT: 'hsl(var(--accent))', foreground: 'hsl(var(--accent-foreground))' },
        destructive: { DEFAULT: 'hsl(var(--destructive))', foreground: 'hsl(var(--destructive-foreground))' },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        mint: '#98FFD8',
        sea: '#004E64',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
      },
      boxShadow: {
        'mint': '0 8px 32px rgba(152,255,216,0.35)',
        'sea': '0 8px 32px rgba(0,78,100,0.25)',
        'card': '0 2px 16px rgba(0,78,100,0.07)',
      },
      keyframes: {
        'accordion-down': { from: { height: '0' }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: '0' } },
        'float': { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        'pulse-ring': { '0%': { transform: 'scale(1)', opacity: '1' }, '100%': { transform: 'scale(1.6)', opacity: '0' } },
        'shimmer': { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        'slide-up-bounce': {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '70%': { transform: 'translateY(-5px)', opacity: '1' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        'scale-on-press': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' }
        },
        'bounce-dot': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' }
        },
        'green-flash': {
          '0%, 100%': { backgroundColor: 'transparent' },
          '50%': { backgroundColor: 'rgba(152, 255, 216, 0.3)' }
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' }
        },
        // New mascot animations
        'pulse': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' }
        },
        'spin': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' }
        },
        'ping': {
          '75%, 100%': { transform: 'scale(2)', opacity: '0' }
        },
        'bounce': {
          '0%, 100%': { transform: 'translateY(-25%)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
          '50%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'float': 'float 3.5s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 1.4s ease-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up-bounce': 'slide-up-bounce 0.5s ease-out',
        'scale-on-press': 'scale-on-press 0.2s ease-in-out',
        'bounce-dot': 'bounce-dot 0.6s ease-in-out infinite',
        'green-flash': 'green-flash 0.5s ease-out',
        'shake': 'shake 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97) both',
        // New mascot animations
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin': 'spin 1s linear infinite',
        'ping': 'ping 1s cubic-bezier(0, 0, 0.2, 1) infinite',
        'bounce': 'bounce 1s infinite',
        'fade-in': 'fade-in 0.3s ease-out'
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
