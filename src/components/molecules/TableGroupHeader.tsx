interface Props {
  location: string
  tableName: string
  seatCount: number
  totalSeats: number
}

function TableGroupHeader({
  location,
  tableName,
  seatCount,
  totalSeats,
}: Props) {
  return (
    <div className="md:hidden px-4 pt-4">
      <p className="text-label text-primary tracking-wider uppercase">
        {location}
      </p>
      <div className="flex items-center justify-between mt-1">
        <span className="text-heading-4 text-foreground-heading">
          {tableName}
        </span>
        <span className="text-caption text-foreground-muted">
          {seatCount} / {totalSeats} seats
        </span>
      </div>
      <div className="border-b border-border mt-2 mb-2" />
    </div>
  )
}

export default TableGroupHeader
