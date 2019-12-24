export default {
  name: 'NuxtLink',
  methods: {
    preventDefault(ev) {
      ev.preventDefault()
    }
  },
  template: '<a href="#" @click="preventDefault"><slot/></a>'
}
