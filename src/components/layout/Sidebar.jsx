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
  const { selectedFY, setFY } = useWrdStore()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 6,
      padding: '12px 14px',
      background: 'rgba(255, 255, 255, 0.05)',
      borderRadius: 8,
      marginBottom: 12,
      border: '1px solid rgba(255, 255, 255, 0.1)'
    }}>
      {FY_OPTIONS.map((fy) => {
        const isSelected = selectedFY === fy
        return (
          <button
            key={fy}
            onClick={() => setFY(fy)}
            style={{
              padding: '6px 4px',
              fontSize: '0.72rem',
              fontWeight: isSelected ? 700 : 500,
              color: isSelected ? '#ffffff' : '#cbd5e1',
              backgroundColor: isSelected ? '#0284c7' : 'rgba(30, 41, 59, 0.6)',
              border: isSelected ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 4,
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.15s ease'
            }}
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
