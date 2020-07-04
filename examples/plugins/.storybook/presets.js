const path = require('path')

module.exports = [
  {
    name: 'storybook-preset-nuxt',
    options: {
      configFile: path.resolve(__dirname, '../nuxt.config.js')
    }
  }
]
