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
      '@': path.resolve(__dirname, 'src'),

    },
    configure: webpackConfig => {
      const excludeZodFromSourceMaps = rule => {
        if (!rule) {
          return
        }

        if (rule.loader && rule.loader.includes('source-map-loader')) {
          rule.exclude = [
            ...(Array.isArray(rule.exclude)
              ? rule.exclude
              : rule.exclude
                ? [rule.exclude]
                : []),
            path.resolve(__dirname, 'node_modules/zod')
          ]
        }

        if (Array.isArray(rule.oneOf)) {
          rule.oneOf.forEach(excludeZodFromSourceMaps)
        }

        if (Array.isArray(rule.rules)) {
          rule.rules.forEach(excludeZodFromSourceMaps)
        }
      }

      webpackConfig.module.rules.forEach(excludeZodFromSourceMaps)

      return webpackConfig
    }
  }
}
