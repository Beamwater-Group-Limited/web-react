import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Layout } from 'antd'
import MenuComp from './menu'
import { useEffect } from 'react'
const LayoutDom = () => {
  const navigate = useNavigate()
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/chat')
    }
  }, [location.pathname])
  const { Header, Content } = Layout
  return (
    <Layout className="w-full h-full">
      <Header className="bg-white border-0 border-b-[1px] border-solid border-slate-200">
        <MenuComp />
      </Header>
      <Layout>
        <Content className="lg:p-4 sm:p-[10px]">
          <div className="w-full h-full bg-white lg:p-4 sm:p-[12px] base:p-[16px] rounded-md shadow-lg overflow-auto">
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default LayoutDom
