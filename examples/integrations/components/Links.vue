<script>
import Vue from 'vue'

export default {
  props: {
    /**
     * Bar Baz Qux.
     */
    foo: {
      type: [String, Number],
      default: Infinity
    }
  }
}
</script>

<template>
  <ul>
    <li>
      <nuxt-link to="/foo">Foo</nuxt-link>
    </li>
  </ul>
</template>
