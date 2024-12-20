import ImgHandle from '@/view/sys/img'
import { FileImageOutlined } from '@ant-design/icons'
const ImgHandleModule: MenuItemType = {
  order: 4,
  name: '图片处理页面',
  path: '/demo/img',
  icon: <FileImageOutlined />,
  element: <ImgHandle />
}

export default ImgHandleModule
