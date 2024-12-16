import ImgHandle from '@/view/sys/img'
import { HomeOutlined } from '@ant-design/icons'
const ImgHandleModule: MenuItemType = {
  order: 4,
  name: '图片处理',
  path: 'img',
  icon: <HomeOutlined />,
  element: <ImgHandle />
}

export default ImgHandleModule
