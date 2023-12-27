// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['nuxt-primevue', '@pinia/nuxt', '@vueuse/nuxt'],

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
