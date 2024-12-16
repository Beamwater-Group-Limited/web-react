import GlobalSearch from '@/view/sys/global-search'
import { HomeOutlined } from '@ant-design/icons'
const GlobalSearchModule: MenuItemType = {
  order: 2,
  name: '全局检索',
  path: 'global-search',
  icon: <HomeOutlined />,
  element: <GlobalSearch />
}

export default GlobalSearchModule
