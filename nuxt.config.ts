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
      include: ['Button', 'DataTable', 'Column', 'ColumnGroup', 'Row', 'InputText']
    }
  },

  css: ['primevue/resources/themes/lara-light-teal/theme.css', 'primeflex/primeflex.css', 'primeicons/primeicons.css'],

  devtools: {
    enabled: true,
  },
})
