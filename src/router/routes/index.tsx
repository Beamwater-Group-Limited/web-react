import { useRoutes } from 'react-router-dom'
import LayoutDom from '@/view/sys/layout'
import { AppRoutes } from './modules'

export const routes: MenuItemType[] = [
  {
    path: '/',
    name: '欢迎',
    element: <LayoutDom />,
    children: AppRoutes
  }
]

// 封装一层 专门负责显示页面标题
const PageTitle = (route: { element: JSX.Element; name: string }) => {
  const { name, element } = route
  document.title = name
  return <>{element}</>
}
const routesCreater = (targetRoutes: MenuItemType[] = routes): MenuItemType[] => {
  return targetRoutes.map((item) => {
    let route = {
      ...item,
      element: <PageTitle element={item.element} name={item.name}></PageTitle>
    }
    if (!item.children) return route
    return {
      ...route,
      children: routesCreater(item.children)
    }
  })
}

/** 创建routes */
const AppRouter = () => {
  return useRoutes(routesCreater())
}
export default AppRouter
