import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, LabelList
} from 'recharts'
import { formatIndian } from '../../utils/formatters'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="wrd-tooltip">
      <div className="wrd-tooltip__title">{label}</div>
      {payload.map((p, i) => (
        <div key={i} className="wrd-tooltip__row" style={{ color: p.color }}>
          <span>{p.name}:</span>
          <strong>{formatIndian(p.value, 2)} Acres</strong>
        </div>
      ))}
    </div>
  )
}

export default function CommandAreaCoverageBar({ data, selectedFY }) {
  if (!data?.length) return null

  return (
    <div className="wrd-chart-panel" style={{ flex: '1 1 0' }}>
      <div className="wrd-chart-panel__header">
        <div className="wrd-chart-panel__title">
          Command Area Coverage of Dug Tube Well (Acres)
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
            layout="vertical"
            margin={{ top: 4, right: 80, bottom: -6, left: 0 }}
            barGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 8 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              domain={[0, 800000]}
              hide
            />
            <YAxis
              type="category"
              dataKey="fy"
              tick={{ fill: '#334155', fontSize: 8, fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Target Bar */}
            <Bar
              dataKey="target"
              name="Target"
              fill="#7073c1"
              radius={[0, 3, 3, 0]}
              maxBarSize={11}
            >
              <LabelList
                dataKey="target"
                position="right"
                offset={4}
                fill="#334155"
                fontSize={7.5}
                fontWeight={700}
                formatter={(v) => v ? formatIndian(v, 2) : ''}
              />
            </Bar>

            {/* Actual Bar */}
            <Bar
              dataKey="actual"
              name="Actual"
              fill="#f29879"
              radius={[0, 3, 3, 0]}
              maxBarSize={11}
            >
              <LabelList
                dataKey="actual"
                position="right"
                offset={4}
                fill="#c2410c"
                fontSize={7.5}
                fontWeight={700}
                formatter={(v) => v ? formatIndian(v, 2) : ''}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
