import FlowListPage from '@/view/sys/flow-list'
import { HomeOutlined } from '@ant-design/icons'
const FlowListModule: MenuItemType = {
  order: 7,
  name: '流程列表页面',
  path: '/demo/flow-list',
  hidden: true,
  icon: <HomeOutlined />,
  element: <FlowListPage />
}

export default FlowListModule
