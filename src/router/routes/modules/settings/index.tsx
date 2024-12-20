import SettingsPage from '@/view/sys/settings'
import { HomeOutlined } from '@ant-design/icons'
const SettingsModule: MenuItemType = {
  order: 8,
  name: '配置页面',
  path: '/demo/settings',
  hidden: true,
  icon: <HomeOutlined />,
  element: <SettingsPage />
}

export default SettingsModule
