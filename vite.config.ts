import path from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import WindiCSS from 'vite-plugin-windicss'
import VueI18n from '@intlify/vite-plugin-vue-i18n'
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import Components from 'unplugin-vue-components/vite'
import AutoImport from 'unplugin-auto-import/vite'
import ViteFonts from 'vite-plugin-fonts'
import svgLoader from 'vite-svg-loader'
import replace from '@rollup/plugin-replace'
const on = JSON.stringify(true)
const off = JSON.stringify(false)

export default defineConfig({
  build: {
    assetsInlineLimit: 0,
    rollupOptions: {
      plugins: [
        replace({
          'preventAssignment': true,
          'typeof CANVAS_RENDERER': on,
          'typeof WEBGL_RENDERER': on,
          'typeof FEATURE_SOUND': on,
          'typeof EXPERIMENTAL': off,
          'typeof PLUGIN_CAMERA3D': off,
          'typeof PLUGIN_FBINSTANT': off,
        }),
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
    include: ['vue', 'vue-router', '@vueuse/core'],
  },
  plugins: [
    vue(),
    svgLoader(),
    AutoImport({
      imports: ['vue', 'vue-router', 'vue-i18n', '@vueuse/core'],
      dts: 'src/auto-imports.d.ts',
    }),
    Icons({
      autoInstall: true,
    }),
    Components({
      resolvers: [
        IconsResolver({
          componentPrefix: '',
          // enabledCollections: ['carbon']
        }),
      ],
      dts: 'src/components.d.ts',
    }),
    ViteFonts({
      google: {
        families: ['Open Sans', 'Montserrat', 'Fira Sans'],
      },
    }),

    WindiCSS({
      safelist: 'prose prose-sm m-auto text-left',
    }),

    VueI18n({
      include: [path.resolve(__dirname, './locales/**')],
    }),
  ],
})
