<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
  </div>
</template>

<script>
import { getPlatform } from '../../lib/platform'

export default {
  name: 'hello',
  data () {
    return {
      msg: 'Vue.js running in el mumuxe' + getPlatform()
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1 {
  font-weight: normal;
}
</style>
