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
        const data = (await axios.get("/api/test")).data
        console.log("GJ it works")
        console.log(data)
      } catch(err) {
        console.log("GJ it still doesn't work")
        console.log(err)
      }
      return
    }
  },
}
</script>