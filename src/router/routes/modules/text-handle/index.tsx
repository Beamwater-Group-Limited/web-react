import TextHandle from '@/view/sys/text-handle'
import { HomeOutlined } from '@ant-design/icons'
const TextHandleModule: MenuItemType = {
  order: 3,
  name: '文本处理',
  path: 'text-handle',
  icon: <HomeOutlined />,
  element: <TextHandle />
}

export default TextHandleModule
