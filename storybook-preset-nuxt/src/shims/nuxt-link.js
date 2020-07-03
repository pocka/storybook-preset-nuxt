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
  render(h) {
    return h(
      this.tag,
      {
        attrs: {
          href: this.to
        },
        on: {
          click(ev) {
            ev.preventDefault()
          }
        }
      },
      this.$slots.default
    )
  }
}
