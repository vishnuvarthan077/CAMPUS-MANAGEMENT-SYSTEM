function StatsBar({ stats }) {
  const tiles = [
    { label: 'Total Drives', value: stats.totalDrives ?? '—' },
    { label: 'Students Placed', value: stats.totalPlacements ?? '—' },
    { label: 'Highest Package', value: stats.highestCtc ? `${stats.highestCtc} LPA` : '—' },
    { label: 'Average Package', value: stats.averageCtc ? `${stats.averageCtc} LPA` : '—' },
  ]

  return (
    <div className="stats-bar">
      {tiles.map((tile) => (
        <div key={tile.label} className="stat-tile">
          <div className="stat-value">{tile.value}</div>
          <div className="stat-label">{tile.label}</div>
        </div>
      ))}
    </div>
  )
}

export default StatsBar
