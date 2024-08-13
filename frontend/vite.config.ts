import { defineConfig } from 'vite'
import path from "path";
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  
  // This helps for using @ alias for import statements
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
