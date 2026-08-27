import React from 'react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell, LabelList
} from 'recharts'
import { formatIndian } from '../../utils/formatters'

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="wrd-tooltip">
      <div className="wrd-tooltip__title">{d.fy}</div>
      <div className="wrd-tooltip__row" style={{ color: d.isTarget ? '#7073c1' : '#ea580c' }}>
        <span>{d.isTarget ? 'Target' : 'Actual'}:</span>
        <strong>{formatIndian(d.value)}</strong>
      </div>
    </div>
  )
}

export default function GroundWaterRechargeBar({ data, selectedFY }) {
  if (!data?.length) return null

  return (
    <div className="wrd-chart-panel" style={{ flex: '1.2 1 0' }}>
      <div className="wrd-chart-panel__header">
        <div className="wrd-chart-panel__title">
          Number of Ground Water Recharge Structures
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
            margin={{ top: 2, right: 34, bottom: -6, left: -6 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" horizontal={false} />
            <XAxis
              type="number"
              tick={{ fill: '#64748b', fontSize: 8 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              domain={[0, 1400]}
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
            <Bar dataKey="value" radius={[0, 3, 3, 0]} maxBarSize={11}>
              {data.map((entry, index) => (
                <Cell
                  key={index}
                  fill={entry.isTarget ? '#7073c1' : '#f29879'}
                />
              ))}
              <LabelList
                dataKey="value"
                position="right"
                offset={4}
                fill="#334155"
                fontSize={8}
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
