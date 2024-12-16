// import.meta.glob() 直接引入所有的模块 Vite 独有的功能
const modules = import.meta.glob('./**/index.tsx', { eager: true })
/** routes为所有菜单栏内的所有路由 */
export const menu: MenuItemType[] = []
export const AppRoutes: MenuItemType[] = []
// 加入到路由集合中
Object.keys(modules).forEach((key) => {
  const mod = (modules as any)[key].default || {}
  const modList = Array.isArray(mod) ? [...mod] : [mod]
  const routeItem = modList[0] as MenuItemType
  if (routeItem.order) {
    menu[routeItem.order - 1] = {
      name: routeItem.name,
      path: routeItem.path,
      icon: routeItem?.icon,
      element: routeItem.element
    }
  }
})
AppRoutes.push(...menu)
