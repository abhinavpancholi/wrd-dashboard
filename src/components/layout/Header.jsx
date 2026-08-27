import React from 'react'
import useWrdStore from '../../context/WrdStore'

export default function Header() {
  const selectedFY = useWrdStore((s) => s.selectedFY) || '2026-27'

  return (
    <header className="wrd-header">
      {/* Left: Gujarat Multi-color Map & GRIT Logo */}
      <div className="wrd-header__left">
        <img
          src="/gujarat_map.png"
          alt="Gujarat Map"
          className="wrd-header__map-logo"
        />
        <img
          src="/gritlogo.jpg"
          alt="GRIT Logo"
          className="wrd-header__grit-logo"
        />
      </div>

      {/* Center: Title & Dynamic Department / FY */}
      <div className="wrd-header__title-block">
        <div className="wrd-header__title">
          Gujarat Rajya Institution For Transformation
        </div>
        <div className="wrd-header__subtitle">
          Water Resource Department, {selectedFY}
        </div>
      </div>

      {/* Right: CM Portrait / Official Profile */}
      <div className="wrd-header__right">
        <img
          src="/cm_photo.png"
          alt="CM Portrait"
          className="wrd-header__cm-photo"
        />
      </div>
    </header>
  )
}
