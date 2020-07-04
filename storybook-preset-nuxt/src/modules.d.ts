declare module 'nuxt' {
  import * as webpack from 'webpack'

  export interface LoadOptions {
    for?: string
    rootDir?: string
    configFile?: string
    configContext?: object
  }

  export function getWebpackConfig(
    name?: string,
    options?: LoadOptions
  ): Promise<webpack.Configuration>

  export interface Nuxt {
    options: {
      plugins: any[]
      css: string[]
    }
  }

  export function loadNuxt(options?: LoadOptions): Promise<Nuxt>

  export interface Builder {
    bundleBuilder: {
      getWebpackConfig(name: string): Promise<webpack.Configuration>
      buildContext: any
    }

    build(): Promise<void>
  }

  export function getBuilder(nuxt: Nuxt): Promise<Builder>

  export function build(nuxt: any): Promise<void>
}
