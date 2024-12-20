import TextHandle from '@/view/sys/text-handle'
import { FileSyncOutlined } from '@ant-design/icons'
const TextHandleModule: MenuItemType = {
  order: 3,
  name: '文本处理页面',
  path: '/demo/text-handle',
  icon: <FileSyncOutlined />,
  element: <TextHandle />
}

export default TextHandleModule
