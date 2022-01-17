import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const backendUrl = mode === 'development' ? 'localhost:5000' : 'backend:5000'
  return {
    plugins: [vue()],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
        '@interfaces': resolve(__dirname, '../common/interfaces'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://' + backendUrl,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
