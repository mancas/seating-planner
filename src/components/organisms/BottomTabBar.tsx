import { LuSquarePen, LuUser, LuWrench, LuEllipsis } from 'react-icons/lu'
import TabBarItem from '../atoms/TabBarItem'

interface Props {
  activeTab: string
  onTabChange: (tab: string) => void
}

function BottomTabBar({ activeTab, onTabChange }: Props) {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-surface border-t border-border">
      <div className="flex items-center justify-around py-2 px-4">
        <TabBarItem
          icon={<LuSquarePen size={16} />}
          label="CANVAS"
          isActive={activeTab === 'canvas'}
          onClick={() => onTabChange('canvas')}
        />
        <TabBarItem
          icon={<LuUser size={16} />}
          label="GUESTS"
          isActive={activeTab === 'guests'}
          onClick={() => onTabChange('guests')}
        />
        <TabBarItem
          icon={<LuWrench size={16} />}
          label="TOOLS"
          isActive={activeTab === 'tools'}
          onClick={() => onTabChange('tools')}
        />
        <TabBarItem
          icon={<LuEllipsis size={16} />}
          label="MORE"
          isActive={activeTab === 'more'}
          onClick={() => onTabChange('more')}
        />
      </div>
    </nav>
  )
}

export default BottomTabBar
