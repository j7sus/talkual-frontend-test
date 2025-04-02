// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/strapi'],
  strapi: {
    url: 'http://localhost:1337',
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/global.css',
  ],
})
