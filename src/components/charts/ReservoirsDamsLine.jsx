import React from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
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
          <strong>{formatIndian(p.value)}</strong>
        </div>
      ))}
    </div>
  )
}

export default function ReservoirsDamsLine({ data, selectedFY }) {
  if (!data?.length) return null

  return (
    <div className="wrd-chart-panel" style={{ flex: '1 1 0' }}>
      <div className="wrd-chart-panel__header">
        <div className="wrd-chart-panel__title">
          Number of Reservoirs/Dams To Be Assessed
        </div>
        <div className="wrd-chart-panel__legend">
          <span><span className="wrd-legend-dot wrd-legend-dot--target"></span>Target</span>
          <span><span className="wrd-legend-dot wrd-legend-dot--actual"></span>Actual</span>
        </div>
      </div>

      <div className="wrd-chart-panel__body">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 18, right: 20, bottom: 2, left: 20 }}>
            <defs>
              <linearGradient id="resTargetGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7073c1" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#7073c1" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="resActualGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f29879" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#f29879" stopOpacity={0.05} />
              </linearGradient>
            </defs>
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
              domain={[0, 'dataMax + 60']}
              hide
            />
            <Tooltip content={<CustomTooltip />} />
            
            {/* Target Area */}
            <Area
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#7073c1"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#resTargetGrad)"
              dot={{ fill: '#7073c1', r: 3 }}
              activeDot={{ r: 5 }}
            >
              <LabelList
                dataKey="target"
                position="top"
                offset={6}
                fill="#475569"
                fontSize={7.5}
                fontWeight={700}
                formatter={(v) => v ? formatIndian(v) : ''}
              />
            </Area>

            {/* Actual Area */}
            <Area
              type="monotone"
              dataKey="actual"
              name="Actual"
              stroke="#f29879"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#resActualGrad)"
              dot={{ fill: '#f29879', r: 3 }}
              activeDot={{ r: 5 }}
            >
              <LabelList
                dataKey="actual"
                position="bottom"
                offset={6}
                fill="#c2410c"
                fontSize={7.5}
                fontWeight={700}
                formatter={(v) => v ? formatIndian(v) : ''}
              />
            </Area>
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
