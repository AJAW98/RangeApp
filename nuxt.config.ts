// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    ssr: false,
    devtools: { enabled: true },
    modules: [
        'nuxt-primevue',
    ],
    primevue: {
      /* Options */
    },
    css: [
        'primevue/resources/themes/aura-light-green/theme.css',
        'primeicons/primeicons.css',
        'primeflex/primeflex.css',
        '~/assets/scss/main.scss',
    ]
})
