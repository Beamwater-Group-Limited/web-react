import GlobalSearch from '@/view/sys/global-search'
import { SearchOutlined } from '@ant-design/icons'
const GlobalSearchModule: MenuItemType = {
  order: 2,
  name: '全局检索页面',
  path: 'global-search',
  icon: <SearchOutlined />,
  element: <GlobalSearch />
}

export default GlobalSearchModule
