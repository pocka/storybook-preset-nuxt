import * as nuxt from 'nuxt'
import { Configuration, DefinePlugin } from 'webpack'
import InjectPlugin, { ENTRY_ORDER } from 'webpack-inject-plugin'

import { createShim } from './nuxtPluginShim'

export interface PresetOptions {
  /**
   * Path to nuxt.config.js
   */
  nuxtConfig?: string
}

const webpack = async (
  config: Configuration,
  options: PresetOptions
): Promise<Configuration> => {
  const nuxtInstance = await nuxt.loadNuxt({
    for: 'dev',
    configFile: options.nuxtConfig
  })

  const builder = await nuxt.getBuilder(nuxtInstance)

  // We need call this method to create .nuxt directory.
  // FIXME: Nuxt starts watch task and it results in duplicated watch processes.
  await builder.build()

  const nuxtWebpack = await builder.bundleBuilder.getWebpackConfig('client')

  // Use Nuxt's DefinePlugin so users can use globals defined by Nuxt
  // (e.g. `process.browser`, `process.modern`).
  const definePlugin = nuxtWebpack.plugins?.find(p => p instanceof DefinePlugin)

  if (definePlugin) {
    // Put Nuxt's one first in order to prevent it from overwriting
    // variables defined by Storybook.
    config.plugins = [definePlugin, ...(config.plugins ?? [])]
  }

  // Filter-out rules to avoid conflict with Nuxt's.
  const preservedRules =
    config.module?.rules.filter(rule => {
      // Preserve complex rules.
      // It's too hard to test webpack rule exhaustively :(
      if (!(rule.test instanceof RegExp)) {
        return true
      }

      return rule.test.test('.md') || rule.test.test('.mdx')
    }) ?? []

  // Merge rules.
  config.module!.rules = [
    ...preservedRules,
    ...(nuxtWebpack.module?.rules ?? [])
  ]

  // Replace resolve section.
  // Keep existing aliases for safety.
  config.resolve = {
    ...nuxtWebpack.resolve,
    alias: {
      ...nuxtWebpack.resolve?.alias,
      ...config.resolve?.alias
    }
  }

  const clientPlugins = nuxtInstance.options.plugins
    .map(plugin => {
      if (typeof plugin === 'string') {
        return {
          src: plugin,
          mode: 'all'
        }
      }

      return plugin
    })
    .filter(plugin => plugin.mode !== 'server')
    .map(plugin => plugin.src)

  // Simulate Nuxt plugin system by adding shim code.
  const shim = createShim(clientPlugins)

  config.plugins?.push(
    new InjectPlugin(() => shim, {
      entryName: 'nuxt-shim.js',
      entryOrder: ENTRY_ORDER.First
    })
  )

  const shims = require.resolve('./shims')

  // Inject global CSSs
  config.entry = [
    shims,
    ...nuxtInstance.options.css,
    ...(config.entry as string[])
  ]

  return config
}

const webpackFinal = (config: Configuration): Configuration => {
  // Remove Storybook's base rules.
  // TODO: Suggest better preset configuration (no hard-coding)
  //       https://github.com/storybookjs/storybook/blob/next/lib/core/src/server/preview/base-webpack.config.js#L7
  config.module!.rules = config.module!.rules.slice(0, -3)

  return config
}

export default { webpack, webpackFinal }
