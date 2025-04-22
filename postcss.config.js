export default {
  plugins: {
    'postcss-import': {},
    'postcss-nesting': {},
    '@tailwindcss/postcss': {
      config: './tailwind.config.js'
    },
    'autoprefixer': {},
  }
} 