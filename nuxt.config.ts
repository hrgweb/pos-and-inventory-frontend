// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-primevue'
  ],
  primevue: {
    usePrimeVue: true,
    options: {
      ripple: true
    },
    components: {
      include: ['Button']
    }
  },
  css: ['primevue/resources/themes/lara-light-teal/theme.css'],
})
