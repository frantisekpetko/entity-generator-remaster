import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import { ViteMinifyPlugin } from 'vite-plugin-minify'
//import compress from 'vite-plugin-compress'


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), ViteMinifyPlugin({}), viteCompression()],
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },

})
