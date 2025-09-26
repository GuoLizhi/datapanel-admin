import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import { ViteEjsPlugin } from 'vite-plugin-ejs'
import { terser } from 'rollup-plugin-terser'
// import importToCDN from 'vite-plugin-cdn-import'
// import createExternal from 'vite-plugin-external'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    ViteEjsPlugin(config => {
      return {
        title: '量化交易管理后台',
        // isInner: config.env.MODE === 'inner',
        version: new Date().getTime()
      }
    }),
    visualizer({
      filename: 'stats.html', // 默认在项目根目录下生成stats.html文件，可自定义
      open: true // 生成后自动打开浏览器查看
    })
    // // 引入CDN
    // importToCDN({
    //   modules: [{
    //     name: 'antd',
    //     var: 'antd',
    //     path: 'https://qqlh.s3.ap-northeast-1.amazonaws.com/antd@5.1.1.min.js'
    //   }]
    // })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  server: {
    host: '127.0.0.1',
    sourcemap: true,
    port: 5500
    // cors: true,
    // proxy: {
    // '/api': {
    //   target: 'http://datapanel.dev',
    //   changeOrigin: true
    // }
    // '^/api/.*': {
    //   target: 'http://datapanel.dev',
    //   changeOrigin: true
    // }
    // proxy: {
    //   '/api': {
    //     target: 'http://datapanel.dev', // 后端实际地址
    //     changeOrigin: true,
    //     rewrite: (path) => path.replace(/^\/api/, ''),
    //     // 关键配置：绕过预检请求
    //     bypass: (req, res, proxyOpts) => {
    //       if (req.method === 'OPTIONS') {
    //         res.writeHead(200, {
    //           'Access-Control-Allow-Origin': '*',
    //           'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
    //           'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    //         })
    //         res.end()
    //       }
    //     }
    //   }
    // }
    // }
  },
  build: {
    minify: 'terser',
    rollupOptions: {
      treeshake: true,
      // external: ['@dnd-kit'],
      output: {
        manualChunks: {
          react: [
            'react', 'react-dom', 'react-router-dom',
            'react-redux', 'react-resizable', 'react-beautiful-dnd',
            '@reduxjs/toolkit'
          ],
          antd: ['antd', 'antd-colorpicker'],
          echarts: [
            'echarts-for-react',
            'echarts',
            'echarts-gl'
          ],
          utils: ['axios', 'dayjs', 'qrcode', 'prop-types', 'query-string', 'ahooks', 'i18next', 'xlsx', 'lodash', '@monaco-editor/react'],
          layout: ['./src/components/Layout']
        }
        // manualChunks (id) {
        //   if (id.includes('node_modules') && id.includes('react')) {
        //     return 'react'
        //   }
        //   if (id.includes('node_modules') && id.includes('echarts')) {
        //     return 'echarts'
        //   }
        //   if (id.includes('node_modules') && id.includes('antd')) {
        //     return 'antd'
        //   }

        //   if (id.includes('node_modules')) {
        //     return 'utils'
        //   }

        //   // if (id.includes('RobotListSearchGroup')) {
        //   //   return 'business-components'
        //   // }

        //   // 业务代码（保持默认主包，或自定义业务包名）
        //   return 'index'
        // }
        // manualChunks (id) {
        //   if (id.includes('node_modules')) {
        //     // 提取更精确的包名（支持作用域包）
        //     console.log('id----', id)
        //     if (/react/.test(id)) return 'chunk_react'
        //     if (id.includes('antd')) return 'chunk_antd'
        //     if (id.includes('echarts')) return 'chunk_echarts'

        //     // 其他依赖按包名单独拆分（可选合并策略）
        //     return 'chunkFile'
        //   }
        // },
        // // // 文件名哈希策略（长期缓存优化）
        // entryFileNames: 'assets/[name]-[hash].js',
        // // chunkFileNames: 'assets/[name]-[hash].js'
        // chunkFileNames: (chunkInfo) => {
        //   if (chunkInfo.name === 'chunk_react') {
        //     return 'assets/chunk_react-[hash].js' // 单独命名，便于优先加载
        //   }
        //   return 'assets/[name]-[hash].js'
        // minChunkSize: 500,
        // maxSize: 1500
      }
    },
    plugins: [
      visualizer({
        filename: 'stats.html', // 默认在项目根目录下生成stats.html文件，可自定义
        open: true // 生成后自动打开浏览器查看
      }),
      terser({
        format: {
          // 取消代码注释
          comments: false
        },
        compress: {
          drop_console: true // 移除 console 日志
        }
      })
    ],
    // output: {
    //   entryFileNames: '[name].js',
    //   assetFileNames: '[name].js',
    //   chunkFileNames: '[name].js'
    // }
    terserOptions: {
      compress: {
        keep_classnames: false,
        keep_fnames: false,
        drop_console: true
      }
    }
  }
  // optimizeDeps: {
  //   exclude: ['react', 'react-dom']
  // }
})
