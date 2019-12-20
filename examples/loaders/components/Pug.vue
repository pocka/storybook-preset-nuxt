<template lang="pug">
  h1.red Hello, {{ name }}
</template>

<script>
export default {
  data() {
    return {
      name: 'Pug'
    }
  }
}
</script>

<style scoped>
.red {
  color: red;
}
</style>
