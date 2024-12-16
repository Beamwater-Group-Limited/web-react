import GlobalSearch from '@/view/sys/global-search'
import { SearchOutlined } from '@ant-design/icons'
const GlobalSearchModule: MenuItemType = {
  order: 2,
  name: '全局检索',
  path: 'global-search',
  icon: <SearchOutlined />,
  element: <GlobalSearch />
}

export default GlobalSearchModule
