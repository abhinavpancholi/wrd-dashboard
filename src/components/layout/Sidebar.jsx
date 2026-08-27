import React from 'react'
import { NavLink } from 'react-router-dom'
import { Lightbulb, FileText, BarChart3 } from 'lucide-react'
import useWrdStore from '../../context/WrdStore'

const FY_OPTIONS = [
  '2022-23', '2023-24',
  '2024-25', '2025-26',
  '2026-27', '2027-28',
  '2028-29', '2029-30'
]

function StatCards() {
  const config = useWrdStore((s) => s.config)

  const interventions = config?.interventions || 9
  const actionableSteps = config?.actionableSteps || 12
  const kpis = config?.kpis || 14

  return (
    <div className="wrd-sidebar__top">
      {/* 1. Interventions */}
      <div className="wrd-stat-card wrd-stat-card--teal">
        <Lightbulb size={18} className="wrd-stat-card__icon" />
        <div className="wrd-stat-card__label">Interventions</div>
        <div className="wrd-stat-card__value">{interventions}</div>
      </div>

      {/* 2. Actionable Steps */}
      <div className="wrd-stat-card wrd-stat-card--blue">
        <FileText size={18} className="wrd-stat-card__icon" />
        <div className="wrd-stat-card__label">Actionable Steps</div>
        <div className="wrd-stat-card__value">{actionableSteps}</div>
      </div>

      {/* 3. KPIs */}
      <div className="wrd-stat-card wrd-stat-card--green">
        <BarChart3 size={18} className="wrd-stat-card__icon" />
        <div className="wrd-stat-card__label">KPIs</div>
        <div className="wrd-stat-card__value">{kpis}</div>
      </div>
    </div>
  )
}

function FySelector() {
  const { selectedFY, toggleFY } = useWrdStore()

  return (
    <div className="wrd-fy-container">
      <div className="wrd-fy-title">Financial Year</div>
      <div className="wrd-fy-grid">
        {FY_OPTIONS.map((fy) => {
          const isSelected = selectedFY === fy
          return (
            <button
              key={fy}
              className={`wrd-fy-btn ${isSelected ? 'wrd-fy-btn--active' : ''}`}
              onClick={() => toggleFY(fy)}
              title={isSelected ? `Click to clear ${fy} filter` : `Filter by ${fy}`}
            >
              {fy}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="wrd-sidebar">
      {/* Top Stat Cards */}
      <StatCards />

      {/* Nav List */}
      <nav className="wrd-sidebar__nav">
        <NavLink
          to="/summary"
          className={({ isActive }) =>
            `wrd-nav-item ${isActive ? 'wrd-nav-item--active' : ''}`
          }
        >
          Summary
        </NavLink>
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `wrd-nav-item ${isActive ? 'wrd-nav-item--active' : ''}`
          }
        >
          Overview
        </NavLink>
      </nav>

      {/* Bottom FY Grid */}
      <FySelector />
    </aside>
  )
}
