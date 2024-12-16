import FlowListPage from '@/view/sys/flow-list'
import { HomeOutlined } from '@ant-design/icons'
const FlowListModule: MenuItemType = {
  order: 3,
  name: '流程列表',
  path: 'flow-list',
  icon: <HomeOutlined />,
  element: <FlowListPage />
}

export default FlowListModule
