import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// const path = require('node:path');


// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss(),
    
  ],
  server: {
    port:3000,
    open:true,
  },
  // resolve:{
  //   alias:{
  //     '@':'src',
  //   }
  // },
  // base : '/menteeFrontend/',
})
