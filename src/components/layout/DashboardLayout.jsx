import React, { useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import useWrdStore from '../../context/WrdStore'

export default function DashboardLayout() {
  const { initData, loading, error } = useWrdStore()

  useEffect(() => {
    initData()
  }, [initData])

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0b192e',
        color: '#ffffff',
        fontFamily: 'Inter, sans-serif'
      }}>
        <div style={{
          width: 40,
          height: 40,
          border: '3px solid rgba(255,255,255,0.15)',
          borderTopColor: '#38bdf8',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
          marginBottom: 16
        }} />
        <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#e2e8f0' }}>
          Loading WRD Dashboard...
        </div>
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#0f172a',
        color: '#f87171',
        padding: 20,
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: 8 }}>
          Error Loading Dashboard Data
        </div>
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{error}</div>
      </div>
    )
  }

  return (
    <div className="wrd-app">
      <Sidebar />
      <div className="wrd-main-layout">
        <Header />
        <div className="wrd-mission-banner">
          <div className="wrd-mission-banner__text">
            Gujarat Water Resources Development Corporation Ltd. was created in 1975 to concentrate on ground water investigation, exploration, management &amp; recharge works in the State of Gujarat.
          </div>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
