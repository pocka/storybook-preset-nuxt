import { addDecorator, configure } from '@storybook/vue'

// automatically import all files ending in *.stories.js
configure(require.context('../components', true, /\.stories\.js$/), module)

addDecorator(() => '<v-app><story/></v-app>')
