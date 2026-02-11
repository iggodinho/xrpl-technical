// https://nuxt.com/docs/api/configuration/nuxt-config
import tailwindcss from "@tailwindcss/vite";
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['./app/assets/css/main.css'],
    vite: {
      plugins: [
        tailwindcss(),
      ]},
  runtimeConfig: {
    xummApiKey: '23c237e2-a1c4-4684-aadd-6dd66f7bdd46',
    xummApiSecret: '149c7642-21a4-424b-b1e1-b449618e8272',
    }
})
