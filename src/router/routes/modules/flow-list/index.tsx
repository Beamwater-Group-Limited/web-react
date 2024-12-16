import FlowListPage from '@/view/sys/flow-list'
import { HomeOutlined } from '@ant-design/icons'
const FlowListModule: MenuItemType = {
  order: 3,
  name: '流程列表',
  path: 'flow-list',
  hidden: true,
  icon: <HomeOutlined />,
  element: <FlowListPage />
}

export default FlowListModule
