const path = require('path')

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
      mode: 'file'
    }
  },
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  }
}
