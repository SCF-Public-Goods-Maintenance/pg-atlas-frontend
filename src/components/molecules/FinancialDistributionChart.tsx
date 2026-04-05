import type { FinancialDistributionChartProps } from '../../types'

export function FinancialDistributionChart({ data, title }: FinancialDistributionChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 1)
  const chartHeight = 120

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:bg-white/5 dark:border-white/15">
      <h3 className="text-sm font-semibold text-surface-dark dark:text-white mb-4">
        {title}
      </h3>

      <div className="flex items-end justify-between gap-2 h-[180px] pt-8">
        {data.map((point) => {
          const barHeight = (point.value / maxValue) * chartHeight
          return (
            <div
              key={point.label}
              className="flex-1 flex flex-col items-center gap-2 group"
              tabIndex={0}
              role="img"
              aria-label={`${point.label}: ${point.value} projects`}
            >
              <div className="relative w-full flex flex-col items-center justify-end h-[140px]">
                {/* Permanent value label */}
                <span className="mb-1 text-xs font-semibold text-surface-dark/70 dark:text-white/60">
                  {point.value}
                </span>

                {/* Tooltip on hover/focus */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 group-focus:opacity-100 transition-opacity bg-surface-dark text-white text-xs py-1 px-2 rounded-md pointer-events-none whitespace-nowrap z-10">
                  {point.value} projects
                </div>

                <div
                  className="w-full max-w-[40px] rounded-t-lg transition-all duration-500 ease-out hover:brightness-110"
                  style={{
                    height: `${barHeight}px`,
                    backgroundColor: point.color,
                    boxShadow: `0 0 20px ${point.color}33`
                  }}
                />
              </div>
              <span className="text-xs font-medium text-surface-dark/50 dark:text-white/40 text-center">
                {point.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
