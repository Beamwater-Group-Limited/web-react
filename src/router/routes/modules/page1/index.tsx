import Page1 from '@/view/settings/page1'
import { HomeOutlined } from '@ant-design/icons'
const Page1Module: MenuItemType = {
  order: 1,
  name: '页面1',
  path: 'settings/page1',
  icon: <HomeOutlined />,
  element: <Page1 />
}

export default Page1Module
