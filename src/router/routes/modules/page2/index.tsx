import TodoList from '@/view/settings/page2'
import { BookOutlined } from '@ant-design/icons'
const Page2Module: MenuItemType = {
  path: 'settings/page2',
  name: '页面2',
  icon: <BookOutlined />,
  order: 2,
  element: <TodoList />
}

export default Page2Module
