import NuxtConfiguration from "@nuxt/config"

const config: NuxtConfiguration = {
  serverMiddleware: ['~/api'],
  head: {
    title: `mapper's choice awards`, 
    link: [
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Ubuntu' },
    ],
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' }
    ]
  },
  css: [
      '~static/css/layout.css',
  ]
}

export default config