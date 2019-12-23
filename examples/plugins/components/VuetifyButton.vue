<template>
  <v-btn class="ma-2" outlined color="primary">{{ text }}</v-btn>
</template>

<script>
export default {
  computed: {
    text() {
      return this.$greet(this.$world)
    }
  }
}
</script>
