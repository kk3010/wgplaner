import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

function getBackendUrl(env) {
  return env === 'development' ? 'localhost:5000' : 'backend:5000'
}

// https://vitejs.dev/config/
export default defineConfig({
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
        target: 'http://' + getBackendUrl(process.env.NODE_ENV),
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
