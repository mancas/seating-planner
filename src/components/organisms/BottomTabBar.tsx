import { LuSquarePen, LuUser, LuSettings, LuReceipt } from 'react-icons/lu'
import { useLocation, useNavigate } from 'react-router'
import TabBarItem from '../atoms/TabBarItem'

function BottomTabBar() {
  const location = useLocation()
  const navigate = useNavigate()
  const isCanvasView = location.pathname === '/seating-plan'
  const isSettingsView = location.pathname === '/settings'
  const isExpensesView = location.pathname.startsWith('/expenses')

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        <TabBarItem
          icon={<LuSquarePen size={16} />}
          label="CANVAS"
          isActive={isCanvasView}
          onClick={() => navigate('/seating-plan')}
        />
        <TabBarItem
          icon={<LuUser size={16} />}
          label="GUESTS"
          isActive={!isCanvasView && !isSettingsView && !isExpensesView}
          onClick={() => navigate('/')}
        />
        <TabBarItem
          icon={<LuSettings size={16} />}
          label="SETTINGS"
          isActive={isSettingsView}
          onClick={() => navigate('/settings')}
        />
        <TabBarItem
          icon={<LuReceipt size={16} />}
          label="EXPENSES"
          isActive={isExpensesView}
          onClick={() => navigate('/expenses')}
        />
      </div>
    </nav>
  )
}

export default BottomTabBar
