import ReactDOM from 'react-dom/client'
import '@/assets/style/reset.css'
import { ConfigProvider } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import AppRouterComp from '@/router'
import '@/assets/style/tailwind.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <ConfigProvider locale={zhCN}>
    <AppRouterComp />
  </ConfigProvider>
)
