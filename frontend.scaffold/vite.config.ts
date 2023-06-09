import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteCompression from 'vite-plugin-compression';
import { ViteMinifyPlugin } from 'vite-plugin-minify'
//import compress from 'vite-plugin-compress'
import compressPlugin from 'vite-plugin-compression';


// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(), 
        ViteMinifyPlugin({}), 
        viteCompression(),
        compressPlugin({
            ext: '.br',
            algorithm: 'brotliCompress',
        })
    ],
    resolve: {
        alias: [{ find: '@', replacement: '/src' }],
    },

})
