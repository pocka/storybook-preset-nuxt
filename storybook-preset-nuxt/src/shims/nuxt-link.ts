export default {
  name: 'NuxtLink',
  props: {
    to: {
      type: String,
      required: true
    },
    tag: {
      type: String,
      default: 'a'
    }
  },
  render(this: any, h: any): any {
    return h(
      this.tag,
      {
        attrs: {
          href: this.to
        },
        on: {
          click(ev: any) {
            ev.preventDefault()
          }
        }
      },
      this.$slots.default
    )
  }
}
