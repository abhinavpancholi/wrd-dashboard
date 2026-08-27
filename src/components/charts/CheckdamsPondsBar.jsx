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
      <div className="wrd-tooltip__row" style={{ color: '#0284c7' }}>
        <span>Structures Built:</span>
        <strong>{formatIndian(payload[0].value)}</strong>
      </div>
    </div>
  )
}

export default function CheckdamsPondsBar({ data, selectedFY }) {
  if (!data?.length) return null

  return (
    <div className="wrd-chart-panel" style={{ flex: '1 1 0' }}>
      <div className="wrd-chart-panel__header">
        <div className="wrd-chart-panel__title">
          Number of Checkdams & Ponds
        </div>
      </div>

      <div className="wrd-chart-panel__body">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 16, right: 14, bottom: 2, left: 14 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="fy"
              tick={{ fill: '#64748b', fontSize: 7.5, fontWeight: 600 }}
              axisLine={{ stroke: '#cbd5e1' }}
              tickLine={false}
              interval={0}
              height={18}
            />
            <YAxis
              tick={{ fill: '#64748b', fontSize: 8 }}
              axisLine={false}
              tickLine={false}
              domain={[0, 450]}
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="value"
              fill="#7dd3fc"
              radius={[3, 3, 0, 0]}
              maxBarSize={22}
            >
              <LabelList
                dataKey="value"
                position="top"
                offset={4}
                fill="#0f172a"
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
