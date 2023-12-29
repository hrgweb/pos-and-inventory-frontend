// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    'nuxt-primevue',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-sanctum'
  ],

  sanctum: {
    baseUrl: 'http://localhost:8101', // Laravel API
    origin: 'http://localhost:3000' // Nuxt app
  },

  primevue: {
    options: {
      ripple: true
    },
    components: {
      include: [
        'Button',
        'DataTable',
        'Column',
        'ColumnGroup',
        'Row',
        'InputText',
        'Dialog',
        'Paginator',
        'Dropdown',
        'Message',
        'Toast',
        'ConfirmPopup'
      ]
    }
  },

  css: [
    'primevue/resources/themes/lara-light-teal/theme.css',
    'primeicons/primeicons.css',
    'primeflex/primeflex.css'
  ],

  devtools: {
    enabled: false
  },

  runtimeConfig: {
    public: {
      backendUrl: process.env.BACKEND_URL
    }
  }
})
