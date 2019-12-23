import Vue from 'vue'

Vue.prototype.$greet = name => `Hello, ${name}!`

export default (ctx, inject) => {
  inject('world', 'WORLD')
}
