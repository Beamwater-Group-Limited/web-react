import DragPage from '@/view/settings/drag'
import { HomeOutlined } from '@ant-design/icons'
const DragModule: MenuItemType = {
  order: 3,
  name: '拖拽页',
  path: 'settings/drag',
  icon: <HomeOutlined />,
  element: <DragPage />
}

export default DragModule
