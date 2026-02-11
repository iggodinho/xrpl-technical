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
    pinataApiKey: 'd42dda0302efd0ba6417',
    pinataApiSecret: 'a3be7c81e92289792f47fb14e7bb2bed41551a90e8fd4964b62f40469c0eeae8',
    pinataJWT: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3NzkyMzFjOS04ODU3LTRiODktOThmYS0zNmE0Njg4ZTFjOTAiLCJlbWFpbCI6Imlnb3JndDMwQGdtYWlsLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJwaW5fcG9saWN5Ijp7InJlZ2lvbnMiOlt7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6IkZSQTEifSx7ImRlc2lyZWRSZXBsaWNhdGlvbkNvdW50IjoxLCJpZCI6Ik5ZQzEifV0sInZlcnNpb24iOjF9LCJtZmFfZW5hYmxlZCI6ZmFsc2UsInN0YXR1cyI6IkFDVElWRSJ9LCJhdXRoZW50aWNhdGlvblR5cGUiOiJzY29wZWRLZXkiLCJzY29wZWRLZXlLZXkiOiJkNDJkZGEwMzAyZWZkMGJhNjQxNyIsInNjb3BlZEtleVNlY3JldCI6ImEzYmU3YzgxZTkyMjg5NzkyZjQ3ZmIxNGU3YmIyYmVkNDE1NTFhOTBlOGZkNDk2NGI2MmY0MDQ2OWMwZWVhZTgiLCJleHAiOjE4MDIyNTQwMjd9.efi2lCeIl1jLuJI4OHLboxSSq4xo9nsm5T0-H1VNago'
    }
})
