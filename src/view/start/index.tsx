import { Card } from 'antd'
import StartPageStyle from './index.module.less'
import { useNavigate } from 'react-router-dom'
/** 开始页面 */
const StartPage = () => {
  const naviagte = useNavigate()
  return (
    <div
      className={`${StartPageStyle['start_page']} flex items-center justify-end pr-[10vw] gap-[5vw]`}
    >
      <Card style={{ width: 300 }} onClick={() => naviagte('/wifi-setting', { replace: false })}>
        <div className="text-xl font-bold mb-4">WIFI配置</div>
        <div>对开发板的WiFi进行配置</div>
      </Card>
      <Card style={{ width: 300 }} onClick={() => naviagte('/demo', { replace: false })}>
        <div className="text-xl font-bold mb-4">Demo尝试</div>
        <div>通过Demo体验我们的产品</div>
      </Card>
    </div>
  )
}

export default StartPage
