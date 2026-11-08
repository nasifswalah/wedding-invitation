import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

/**
 * Link previews (WhatsApp etc.) need ABSOLUTE image URLs. The site address comes from
 * SITE_URL in .env, or is picked up automatically on Vercel / Netlify.
 */
function siteUrl(mode: string) {
  const env = loadEnv(mode, process.cwd(), '')
  const url =
    env.SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    env.URL || // Netlify
    ''
  return url.replace(/\/$/, '')
}

const injectSiteUrl = (url: string): Plugin => ({
  name: 'inject-site-url',
  transformIndexHtml: (html) => html.replaceAll('%SITE_URL%', url),
})

export default defineConfig(({ mode }) => ({
  plugins: [react(), tailwindcss(), injectSiteUrl(siteUrl(mode))],
  server: { port: 5173, host: true },
}))
