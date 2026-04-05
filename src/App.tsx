import { Outlet } from 'react-router'
import TopNav from './components/organisms/TopNav'
import BottomTabBar from './components/organisms/BottomTabBar'

function App() {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav />
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
      <BottomTabBar />
    </div>
  )
}

export default App
