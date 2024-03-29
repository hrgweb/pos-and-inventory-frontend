// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  modules: [
    'nuxt-primevue',
    '@pinia/nuxt',
    '@vueuse/nuxt',
    'nuxt-auth-sanctum'
  ],

  sanctum: {
    baseUrl: 'http://localhost:8105', // Laravel API
    origin: 'http://localhost:3000', // Nuxt app
    redirectIfAuthenticated: true,
    redirect: {
      keepRequestedRoute: false, // Keep requested route in the URL for later redirect
      onLogin: '/', // Redirect to this page after successful login
      onLogout: '/login', // Redirect to this page after successful logout
      onAuthOnly: '/login', // Redirect to this page if user is not authenticated
      onGuestOnly: '/dashboard' // Redirect to this page if user is authenticated
    },
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
        'ConfirmPopup',
        'Tag',
        'BlockUI',
        'ConfirmDialog'
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
