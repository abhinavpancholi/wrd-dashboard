import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts'
import useWrdStore from '../../context/WrdStore'
import { formatIndian } from '../../utils/formatters'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wrd-tooltip">
      <div className="wrd-tooltip__title">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="wrd-tooltip__row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <strong>{formatIndian(p.value)}</strong>
        </div>
      ))}
    </div>
  )
}

export default function FarmersUnderMisBar({ data }) {
  const { selectedFY, toggleFY } = useWrdStore()

  if (!data?.length) return null

  const handleBarClick = (entry) => {
    if (entry?.fy) {
      toggleFY(entry.fy)
    }
  }

  return (
    <div className="wrd-chart-panel" style={{ flex: '1.1 1 0' }}>
      <div className="wrd-chart-panel__header">
        <div className="wrd-chart-panel__title">
          Number of Farmers Under MIS
        </div>
        <div className="wrd-chart-panel__legend">
          <span><span className="wrd-legend-dot wrd-legend-dot--target"></span>Target</span>
          <span><span className="wrd-legend-dot wrd-legend-dot--actual"></span>Actual</span>
        </div>
      </div>

      <div className="wrd-chart-panel__body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 10, bottom: 2, left: 2 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="fy"
              tick={{ fill: '#64748b', fontSize: 7.2, fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              interval={0}
              height={18}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 'dataMax + 50000']}
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Target Bar */}
            <Bar
              dataKey="target"
              name="Target"
              radius={[3, 3, 0, 0]}
              maxBarSize={16}
              onClick={handleBarClick}
            >
              {data.map((entry, index) => {
                const isDimmed = selectedFY && entry.fy !== selectedFY
                return (
                  <Cell
                    key={`target-${index}`}
                    fill="#7073c1"
                    opacity={isDimmed ? 0.25 : 1}
                    cursor="pointer"
                  />
                )
              })}
              <LabelList
                dataKey="target"
                position="top"
                offset={4}
                fill="#334155"
                fontSize={7}
                fontWeight={700}
                formatter={(v, entry) => {
                  if (!v) return ''
                  return formatIndian(v)
                }}
              />
            </Bar>

            {/* Actual Bar */}
            <Bar
              dataKey="actual"
              name="Actual"
              radius={[3, 3, 0, 0]}
              maxBarSize={16}
              onClick={handleBarClick}
            >
              {data.map((entry, index) => {
                const isDimmed = selectedFY && entry.fy !== selectedFY
                return (
                  <Cell
                    key={`actual-${index}`}
                    fill="#f29879"
                    opacity={isDimmed ? 0.25 : 1}
                    cursor="pointer"
                  />
                )
              })}
              <LabelList
                dataKey="actual"
                position="top"
                offset={4}
                fill="#c2410c"
                fontSize={7}
                fontWeight={700}
                formatter={(v) => v ? formatIndian(v) : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
