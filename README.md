# storybook-preset-nuxt

[![npm version](https://badge.fury.io/js/storybook-preset-nuxt.svg)](https://badge.fury.io/js/storybook-preset-nuxt)

One-line [Nuxt.js](https://github.com/nuxt/nuxt.js) configuration for Storybook.

This preset is designed to use alongside [`@storybook/vue`](https://github.com/storybookjs/storybook/tree/master/app/vue).

## Basic usage

First, install this preset to your project.

```sh
# yarn
yarn add -D storybook-preset-nuxt@beta

# npm
npm i -D storybook-preset-nuxt@beta
```

Once installed, add this preset to the appropriate file:

- `.storybook/main.js` (for Storybook >= 5.3)
  ```js
  // .storybook/main.js
  module.exports = { presets: ['storybook-preset-nuxt'] }
  ```
- `.storybook/presets.js` (for Storybook >= 5.1)
  ```js
  // .storybook/presets.js
  module.exports = ['storybook-preset-nuxt']
  ```

## Advanced usage

If you have custom Nuxt config file, you can specify the path to the file.

```js
// .storybook/presets.js
const path = require('path')

module.exports = [
  {
    name: 'storybook-preset-nuxt',
    options: {
      nuxtConfig: path.resolve(__dirname, '../path/to/config')
    }
  }
]
```
