<template>
  <h1 @click="console.log('osu')">Hello world!</h1>
</template>

<script lang="ts">
import axios from "axios"

export default {
  async asyncData(context) {
    try {
      await axios.get("/api/test")
      console.log("GJ")
    } catch(err) {
      console.log("GJ test")
      console.log(err)
    }
    return
  }
}
</script>