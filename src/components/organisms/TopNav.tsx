function TopNav() {
  return (
    <nav className="w-full h-14 bg-surface border-b border-border flex items-center justify-between px-4 md:px-6 shrink-0">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <span className="w-1.5 h-1.5 rounded-full bg-primary md:hidden" />
        <span className="text-label font-semibold text-foreground-heading tracking-wider">
          PLANNER_V1.0
        </span>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2 md:gap-3"></div>
    </nav>
  )
}

export default TopNav
