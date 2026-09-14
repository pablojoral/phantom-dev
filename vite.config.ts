import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Pages serves this project page from a sub-path; the deploy workflow passes it in
// (e.g. `/phantom-dev`). Normalised to exactly one leading and one trailing slash; unset means `/`.
const pagesBasePath = (process.env.PAGES_BASE_PATH ?? '').replace(/^\/+|\/+$/g, '')

// https://vite.dev/config/
export default defineConfig({
  base: pagesBasePath === '' ? '/' : `/${pagesBasePath}/`,
  plugins: [react()],
})
