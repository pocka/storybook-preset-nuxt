import Pug from './Pug.vue'
import Sass from './Sass.vue'
import Scss from './Scss.vue'

export default {
  title: 'Pre-processors'
}

export const pug = () => ({
  components: { Pug },
  template: '<pug/>'
})

export const sass = () => ({
  components: { Sass },
  template: '<sass/>'
})

export const scss = () => ({
  components: { Scss },
  template: '<scss/>'
})
