import type { Config } from 'tailwindcss';
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: { extend: { colors: { phoenix: { gold: '#C6963A', deep: '#1A1040', purple: '#2D1B5E', warm: '#FDF6E3' } }, fontFamily: { vazir: ['var(--font-vazir)'], nastaliq: ['var(--font-nastaliq)'] } } },
  plugins: [],
};
export default config;
