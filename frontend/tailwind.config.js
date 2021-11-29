module.exports = {
  mode: 'jit',
  purge: ['./index.html', './src/**/*.{ts,vue}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('daisyui')],
}
