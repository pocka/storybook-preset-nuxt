import revHash from 'rev-hash'

/**
 * Create shim for Nuxt plugin bootstrapping code.
 * This shim loads all plugins, and execute their
 * bootstrap function (default exported function).
 *
 * @param plugins - A list of path to plugins.
 * @returns Nuxt shim code.
 */
export const createShim = (plugins: string[]) => {
  const modules = plugins.map(path => {
    return {
      path,
      ident: 'plugin_' + revHash(path)
    }
  })

  const importStatements = modules
    .map(mod => `import ${mod.ident} from "${mod.path}"`)
    .join('\n')

  const applyStatements = modules
    .map(
      mod => `if (typeof ${mod.ident} === 'function') {
        ${mod.ident}(context, inject)
      }`
    )
    .join('\n')

  // NOTE: The shim for context object (prototype.app) might be incorrect.
  //       Probably we need to implement more proper shim code.
  return `
    import Vue from 'vue'

    ${importStatements}

    const context = {
      app: {}
    }

    const inject = (_key, value) => {
      const key = '$' + _key

      context[key] = value

      const installKey = '__nuxt_' + key + '_installed'

      if (Vue[installKey]) {
        return
      }

      Vue[installKey] = true

      Vue.use(() => {
        if (!Object.prototype.hasOwnProperty.call(Vue, key)) {
          Object.defineProperty(Vue.prototype, key, {
            get() {
              return value
            }
          })
        }
      })
    }

    ${applyStatements}

    Vue.use(() => {
      for (const key in context.app) {
        Object.defineProperty(Vue.options, key, {
          enumerable: true,
          get() {
            return context.app[key]
          }
        })
      }
    })
  `
}
