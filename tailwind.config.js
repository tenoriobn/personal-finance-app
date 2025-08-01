/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{vue,js,ts}'],
  theme: {
    extend: {
      screens: {
        'sm': '375px',
        'md': '768px',
        'lg': '992px',
        'xl': '1440px',
        'max-sm': { max: '374px' },
        'max-md': { max: '767px' },
        'max-lg': { max: '991px' },
        'max-xl': { max: '1439px' },
      },
      colors: {
        'beige': {
          100: 'hsl(30, 36%, 96%)',
          500: 'hsl(23, 6%, 57%)',
        },
        'slate': {
          600: 'hsl(234, 25%, 52%)',
        },
        'grey': {
          100: 'hsl(0, 0%, 95%)',
          300: 'hsl(0, 0%, 70%)',
          500: 'hsl(0, 0%, 41%)',
          900: 'hsl(252, 7%, 13%)',
        },
        'green': 'hsl(177, 52%, 32%)',
        'green-transparent': 'hsla(175, 51%, 45%, 1)',
        'yellow': 'hsl(28, 73%, 81%)',
        'cyan': 'hsl(190, 52%, 68%)',
        'navy': 'hsl(248, 8%, 41%)',
        'red': 'hsl(7, 58%, 50%)',
        'purple': 'hsl(259, 30%, 56%)',
        'purple-alt': 'hsl(288, 29%, 62%)',
        'turquoise': 'hsl(180, 16%, 42%)',
        'brown': 'hsl(21, 30%, 44%)',
        'magenta': 'hsl(332, 30%, 44%)',
        'blue': 'hsl(205, 48%, 47%)',
        'navy-grey': 'hsl(214, 11%, 63%)',
        'army-green': 'hsl(83, 20%, 47%)',
        'gold': 'hsl(47, 50%, 59%)',
        'orange': 'hsl(18, 47%, 52%)',
        'white': 'hsl(0, 0%, 100%)',
      },
      fontFamily: {
        publicSans: ['"Public Sans"', 'sans-serif'],
      },
      fontSize: {
        'text-32xl': '2rem',
      },
      spacing: {
        50: '4px',
        100: '8px',
        150: '12px',
        200: '16px',
        250: '20px',
        300: '24px',
        400: '32px',
        500: '40px',
      },
    },
  },
  plugins: [],
};
