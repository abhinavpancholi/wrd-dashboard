import React from 'react'
import useWrdStore from '../context/WrdStore'
import { formatIndian } from '../utils/formatters'

const SUMMARY_KPIS = [
  {
    code: 'AIRD-76',
    name: 'Command area coverage of dug well/tube wells for MIS',
    actionable: 'MIS coverage expansion',
    uom: 'Acres',
    periodicity: 'Quarterly',
    fy23: '87,225.84', fy24: '2,46,213.92', fy25: '4,37,365.76', fy26: '5,55,230.76', fy27: '6,67,196.84', fy28: '6,67,196.84', fy29: '6,67,196.84', fy30: '6,67,196.84'
  },
  {
    code: 'AIRD-76 / 137',
    name: 'Nos. of ground water recharge structures',
    actionable: 'Ground water recharging',
    uom: 'Numeric',
    periodicity: 'Quarterly',
    fy23: '1,272 (Act)', fy24: '282 (Act)', fy25: '12 (Act)', fy26: '15 (Act)', fy27: '110', fy28: '130', fy29: '220', fy30: '340'
  },
  {
    code: 'AIRD-76',
    name: 'Number of Farmers Under MIS',
    actionable: 'MIS farmer outreach & onboarding',
    uom: 'Count',
    periodicity: 'Quarterly',
    fy23: '54,516', fy24: '1,53,888', fy25: '2,73,352', fy26: '3,47,020', fy27: '4,17,000', fy28: '4,17,000', fy29: '4,17,000', fy30: '4,17,000'
  },
  {
    code: 'AIRD-77',
    name: 'Area Covered under PINs',
    actionable: 'Pressurized Irrigation Network System',
    uom: 'Acres',
    periodicity: 'Half Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: '1,200', fy28: '1,500', fy29: '2,000', fy30: '2,500'
  },
  {
    code: 'AIRD-78 / 138',
    name: 'Nos. of Checkdams / Ponds / other hydraulic structures',
    actionable: 'Surface water harvesting & storage',
    uom: 'Numeric',
    periodicity: 'Yearly',
    fy23: '263', fy24: '301', fy25: '376', fy26: '—', fy27: '—', fy28: '—', fy29: '—', fy30: '—'
  },
  {
    code: 'AIRD-80',
    name: 'Nos of Training / awareness program for adopting irrigation schedule',
    actionable: 'Capacity building & awareness',
    uom: 'Numeric',
    periodicity: 'Yearly',
    fy23: '302', fy24: '575', fy25: '875', fy26: '975', fy27: '1,175', fy28: '1,375', fy29: '1,625', fy30: '1,875'
  },
  {
    code: 'AIRD-83',
    name: 'Launch Common platform to share best practices of water usage',
    actionable: 'Knowledge sharing & digital governance',
    uom: 'Milestone',
    periodicity: 'Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: 'Launch (1)', fy28: '—', fy29: '—', fy30: '—'
  },
  {
    code: 'AIRD-83',
    name: 'No. of best practices added / identified',
    actionable: 'Documentation of water saving methods',
    uom: 'Numeric',
    periodicity: 'Half Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: '—', fy28: '5', fy29: '5', fy30: '10'
  },
  {
    code: 'AIRD-84',
    name: 'Development of data platform to capture data on Surface and Ground Water levels',
    actionable: 'Hydrological data integration platform',
    uom: 'Milestone',
    periodicity: 'Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: '—', fy28: 'Launch (1)', fy29: '—', fy30: '—'
  },
  {
    code: 'AIRD-84',
    name: 'Nos. of inventive Competitions',
    actionable: 'Innovation challenges for water tech',
    uom: 'Numeric',
    periodicity: 'Half Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: '5', fy28: '10', fy29: '10', fy30: '10'
  },
  {
    code: 'AIRD-84',
    name: 'No. of solutions identified',
    actionable: 'Problem solving & proof of concepts',
    uom: 'Numeric',
    periodicity: 'Half Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: '2', fy28: '2', fy29: '2', fy30: '2'
  },
  {
    code: 'AIRD-84',
    name: 'Nos. of international / national collaborations',
    actionable: 'Strategic partnerships',
    uom: 'Numeric',
    periodicity: 'Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: '1', fy28: '2', fy29: '3', fy30: '3'
  },
  {
    code: 'AIRD-84',
    name: 'No. of innovations / new technologies introduced',
    actionable: 'Technology deployment',
    uom: 'Numeric',
    periodicity: 'Yearly',
    fy23: '—', fy24: '—', fy25: '—', fy26: '—', fy27: '—', fy28: '2', fy29: '2', fy30: '2'
  },
  {
    code: 'AIRD-139',
    name: 'Number of Reservoirs/Dams To Be Assessed',
    actionable: 'Climate resilience assessment of reservoirs',
    uom: 'Numeric',
    periodicity: 'Yearly',
    fy23: '104', fy24: '137', fy25: '226', fy26: '238', fy27: '338', fy28: '429', fy29: '459', fy30: '484'
  }
]

export default function Summary() {
  return (
    <div className="wrd-summary-container">
      <div className="wrd-summary-card">
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            Water Resource Department — KPI Matrix Summary (14 KPIs)
          </h2>
          <p style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Comprehensive target roadmap & historical actual achievements under Viksit Gujarat @2047
          </p>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table className="wrd-table">
            <thead>
              <tr>
                <th>Code</th>
                <th>KPI Title</th>
                <th>UoM</th>
                <th>Periodicity</th>
                <th>2022-23</th>
                <th>2023-24</th>
                <th>2024-25</th>
                <th>2025-26</th>
                <th>2026-27</th>
                <th>2027-28</th>
                <th>2028-29</th>
                <th>2029-30</th>
              </tr>
            </thead>
            <tbody>
              {SUMMARY_KPIS.map((k, i) => (
                <tr key={i}>
                  <td style={{ fontWeight: 700, color: '#2563eb' }}>{k.code}</td>
                  <td style={{ fontWeight: 600, maxWidth: 260 }}>{k.name}</td>
                  <td><span style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, fontSize: '0.68rem', fontWeight: 600 }}>{k.uom}</span></td>
                  <td>{k.periodicity}</td>
                  <td>{k.fy23}</td>
                  <td>{k.fy24}</td>
                  <td>{k.fy25}</td>
                  <td>{k.fy26}</td>
                  <td style={{ fontWeight: 700, color: '#0f766e', background: 'rgba(20,184,166,0.06)' }}>{k.fy27}</td>
                  <td>{k.fy28}</td>
                  <td>{k.fy29}</td>
                  <td>{k.fy30}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
