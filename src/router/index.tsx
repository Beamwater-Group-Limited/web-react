import { BrowserRouter } from 'react-router-dom'
import AppRouter from './routes'
function AppRouterComp() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}

export default AppRouterComp
