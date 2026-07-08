import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        matein: {
          50: '#f0f7f4',
          100: '#dceee4',
          200: '#badecd',
          300: '#8fc6ae',
          400: '#61a98b',
          500: '#3d8d6f',
          600: '#2d7058',
          700: '#265a48',
          800: '#21493c',
          900: '#1c3c32',
          950: '#0e221c',
        },
      },
    },
  },
  plugins: [],
};

export default config;
