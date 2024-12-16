declare type MenuItemType = {
  order?: number //菜单项的排序
  name: string //菜单项的名称
  path: string //菜单项的路径
  icon?: any //菜单项的图标
  hidden?: boolean //是否在菜单中隐藏
  element: JSX.Element
  children?: MenuItemType[] //菜单项的子菜单
}
