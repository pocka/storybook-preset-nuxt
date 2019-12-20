import { Builder } from '@nuxt/builder'
import { Nuxt } from '@nuxt/core'
import { BundleBuilder } from '@nuxt/webpack'
import * as esm from 'esm'
import * as findUp from 'find-up'
import { Configuration, DefinePlugin } from 'webpack'

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
  // TODO: Refactor config obtaining logic
  const nuxtConfigPath = options.nuxtConfig || (await findUp('nuxt.config.js'))

  // Should we allow zero-config project?
  if (!nuxtConfigPath) {
    throw new Error('Could not find Nuxt config file.')
  }

  const nuxtConfigModule = esm(module)(nuxtConfigPath) || {}

  const nuxtConfig = await (async mod => {
    if (typeof mod !== 'function') {
      return mod
    }

    const e = await mod()

    return e.default ?? e
  })(nuxtConfigModule.default ?? nuxtConfigModule)

  const nuxt = new Nuxt(nuxtConfig)

  await nuxt.ready()

  const builder = new Builder(nuxt, BundleBuilder)

  // Run pre-build hook.
  await nuxt.callHook('build:before', builder, nuxt.options.build)

  const nuxtWebpack = await builder.bundleBuilder.getWebpackConfig('Modern')

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

  // TODO: Plugins are heavily depends on .nuxt directory.
  //       So we need to create or mock it.
  /*
  const clientPlugins = (nuxt.options.plugins as any[])
    .filter(plugin => plugin.mode !== 'server')
    .map(plugin => plugin.src)
  */

  // Inject global CSSs and client plugins
  config.entry = [
    // ...clientPlugins,
    ...(config.entry as string[]),
    ...nuxt.options.css
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
