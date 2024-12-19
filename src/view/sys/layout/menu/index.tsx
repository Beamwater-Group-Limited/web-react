import { routes } from '@/router/routes'
import { Menu } from 'antd'
import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
const MenuComp = () => {
  const menuList = routes.find((item) => item.path === '/') as MenuItemType
  /** 创建菜单 */
  const createItems = (
    menu: MenuItemType
  ): { key: string; label: string; icon: any; children?: any[] } | null => {
    if (menu.hidden) return null
    if (!menu.children || menu.children.length === 0) {
      return {
        key: menu.path === '/' ? '/' : `/${menu.path}`,
        label: menu.name,
        icon: menu.icon || ''
      }
    }
    return {
      key: menu.path === '/' ? '/' : `/${menu.path}`,
      label: menu.name,
      icon: menu.icon || '',
      children: menu.children.map((item) => createItems(item))
    }
  }
  const navigate = useNavigate()
  const location = useLocation()

  const [currentPath, setCurrentPath] = useState(location.pathname)
  useEffect(() => {
    setCurrentPath(location.pathname)
  }, [location.pathname])

  //真实菜单
  const items = menuList.children?.map(createItems)
  return (
    <Menu
      selectedKeys={[currentPath]}
      className="lg:text-base sm:text-5xl"
      mode="horizontal"
      items={items}
      onClick={({ key }) => navigate(key)}
    />
  )
}

export default MenuComp
