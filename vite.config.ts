import { defineConfig } from 'vite'

// One origin (localhost:5000) for all apps, so they share localStorage.
const proxy = (port: number) => ({ target: `http://localhost:${port}`, changeOrigin: true, ws: true })

export default defineConfig({
  server: {
    // macOS AirPlay Receiver owns *:5000 (it answers 403 on http://localhost:5000), so bind IPv4 explicitly.
    host: '127.0.0.1',
    port: 5000,
    strictPort: true,
    proxy: {
      '/player': proxy(5101),
      '/admin': proxy(5102),
      '/coach': proxy(5103),
    },
  },
})
