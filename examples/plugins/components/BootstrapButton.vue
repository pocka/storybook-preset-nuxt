<template>
  <b-btn variant="primary">{{ text }}</b-btn>
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
