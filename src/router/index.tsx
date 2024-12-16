import { HashRouter } from 'react-router-dom'
import AppRouter from './routes'
function AppRouterComp() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  )
}

export default AppRouterComp
