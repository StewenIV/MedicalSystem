const path = require('path');

module.exports = {
  babel: {
    plugins: [
      [
        'babel-plugin-styled-components',
        {
          displayName: true,
          fileName: false
        }
      ]
    ]
  },
  style: {
    postcss: {
      plugins: [require('@tailwindcss/postcss'), require('autoprefixer')]
    }
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
};
