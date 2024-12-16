import DragPage from '@/view/sys/drag'
import { HomeOutlined } from '@ant-design/icons'
const DragModule: MenuItemType = {
  order: 2,
  name: '拖拽页',
  path: 'drag',
  icon: <HomeOutlined />,
  element: <DragPage />
}

export default DragModule
