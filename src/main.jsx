import { ConfigProvider } from 'antd'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import zhCN from 'antd/lib/locale/zh_CN'
// import zhCN from 'rc-pagination/es/locale/zh_CN'
import './assets/styles/reset.scss'
import '@/assets/styles/iconfont.css'
import store from './store/index'
import App from './routes'

ReactDOM.createRoot(document.getElementById('root')).render(
  <div>
    <Provider store={store}>
      <ConfigProvider locale={zhCN}>
        <App />
      </ConfigProvider>
    </Provider>
  </div>
)
