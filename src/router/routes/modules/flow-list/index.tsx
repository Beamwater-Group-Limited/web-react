import FlowListPage from '@/view/settings/flow-list'
import { HomeOutlined } from '@ant-design/icons'
const FlowListModule: MenuItemType = {
  order: 4,
  name: '流程列表',
  path: 'settings/flow-list',
  icon: <HomeOutlined />,
  element: <FlowListPage />
}

export default FlowListModule
