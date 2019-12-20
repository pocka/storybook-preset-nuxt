declare module '@nuxt/core' {
  class ModuleContainer {
    public async ready(): Promise<void>
  }

  export class Nuxt {
    constructor(options: any)
    public options: any
    public moduleContainer: ModuleContainer

    public ready(): Promise<Nuxt>
    public callHook(
      name: string,
      instance: unknown,
      options: unknown
    ): Promise<void>
  }
}

declare module '@nuxt/webpack' {
  import { Configuration } from 'webpack'

  export class BundleBuilder {
    constructor(context: unknown)
    public getWebpackConfig(name: 'Client' | 'Modern' | 'Server'): Configuration
  }
}

declare module '@nuxt/builder' {
  import { Nuxt } from '@nuxt/core'
  import { BundleBuilder } from '@nuxt/webpack'

  export class Builder {
    constructor(nuxt: Nuxt, bundleBuilder: InstanceType<BundleBuilder>)
    public bundleBuilder: BundleBuilder
  }
}

declare module 'esm'
