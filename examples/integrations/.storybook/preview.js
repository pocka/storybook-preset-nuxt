import VueRouter from 'storybook-vue-router'

import { addDecorator, addParameters } from '@storybook/vue'

addDecorator(VueRouter())

addParameters({
  docs: {
    inlineStories: true
  }
})
