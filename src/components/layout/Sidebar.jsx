import React from 'react'
import { NavLink } from 'react-router-dom'
import { Target, ListChecks, BarChart3 } from 'lucide-react'
import useWrdStore from '../../context/WrdStore'

const FY_OPTIONS = [
  '2022-23', '2023-24',
  '2024-25', '2025-26',
  '2026-27', '2027-28',
  '2028-29', '2029-30'
]

function FyGrid() {
  const { selectedFY, toggleFY } = useWrdStore()

  return (
    <div className="wrd-fy-card">
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
  )
}

function StatCards() {
  const config = useWrdStore((s) => s.config)

  const interventions = config?.interventions || 9
  const actionableSteps = config?.actionableSteps || 12
  const kpis = config?.kpis || 14

  return (
    <div className="wrd-stat-cards">
      {/* 1. Interventions */}
      <div className="wrd-stat-card wrd-stat-card--teal">
        <div className="wrd-stat-card__icon wrd-stat-card__icon--teal">
          <Target size={20} />
        </div>
        <div className="wrd-stat-card__content">
          <div className="wrd-stat-card__label">INTERVENTIONS</div>
          <div className="wrd-stat-card__value">{interventions}</div>
        </div>
      </div>

      {/* 2. Actionable Steps */}
      <div className="wrd-stat-card wrd-stat-card--blue">
        <div className="wrd-stat-card__icon wrd-stat-card__icon--blue">
          <ListChecks size={20} />
        </div>
        <div className="wrd-stat-card__content">
          <div className="wrd-stat-card__label">ACTIONABLE STEPS</div>
          <div className="wrd-stat-card__value">{actionableSteps}</div>
        </div>
      </div>

      {/* 3. KPIs */}
      <div className="wrd-stat-card wrd-stat-card--purple">
        <div className="wrd-stat-card__icon wrd-stat-card__icon--purple">
          <BarChart3 size={20} />
        </div>
        <div className="wrd-stat-card__content">
          <div className="wrd-stat-card__label">KPIS</div>
          <div className="wrd-stat-card__value">{kpis}</div>
        </div>
      </div>
    </div>
  )
}

export default function Sidebar() {
  return (
    <aside className="wrd-sidebar">
      {/* 1. FY 2-Column Grid at Top */}
      <FyGrid />

      {/* 2. Stat Cards */}
      <StatCards />

      {/* 3. Navigation - Only Overview */}
      <nav className="wrd-sidebar__nav">
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
    </aside>
  )
}
