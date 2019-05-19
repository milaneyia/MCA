<template>
  <h1 @click="testfunc">Hello world!</h1>
</template>

<script>
import axios from "axios"

export default {
  data: () => ({
    test: false,
  }),
  created: async function() {
  },
  methods: {
    testfunc: async function() {
      try {
        await axios.get("/api/test")
        console.log("GJ it works")
      } catch(err) {
        console.log("GJ it still doesn't work")
        console.log(err)
      }
      return
    }
  },
}
</script>