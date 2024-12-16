import DragPage from '@/view/sys/drag'
import { HomeOutlined } from '@ant-design/icons'
const DragModule: MenuItemType = {
  order: 6,
  name: '拖拽页页面',
  path: 'drag',
  icon: <HomeOutlined />,
  hidden: true,
  element: <DragPage />
}

export default DragModule
