import { useState } from 'react'
import { Outlet } from 'react-router'
import TopNav from './components/organisms/TopNav'
import BottomTabBar from './components/organisms/BottomTabBar'
import ProjectActionsSheet from './components/organisms/ProjectActionsSheet'
import { useIsMobile } from './hooks/useIsMobile'

function App() {
  const [isProjectSheetOpen, setIsProjectSheetOpen] = useState(false)
  const isMobile = useIsMobile()

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <TopNav onOpenProjectMenu={() => setIsProjectSheetOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <Outlet />
      </div>
      <BottomTabBar />
      {isMobile && isProjectSheetOpen && (
        <ProjectActionsSheet onClose={() => setIsProjectSheetOpen(false)} />
      )}
    </div>
  )
}

export default App
