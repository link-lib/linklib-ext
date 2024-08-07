export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
    'postcss-parent-selector': {
      selector: '.linklib-ext',
      exclude: '.linklib-ext'
    },
  },
}
