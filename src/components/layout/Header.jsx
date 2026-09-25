import React from 'react'
import useWrdStore from '../../context/WrdStore'

export default function Header() {
  const selectedFY = useWrdStore((s) => s.selectedFY)

  return (
    <header className="wrd-header">
      {/* Left: Gujarat Multi-color Map & GRIT Logo */}
      <div className="wrd-header__left">
        <img
          src="/indiamap.png"
          alt="Gujarat Map"
          className="wrd-header__map-logo"
        />
        {/* <img
          src="/gritlogo.jpg"
          alt="GRIT Logo"
          className="wrd-header__grit-logo"
        /> */}
      </div>

      {/* Center: Title & Dynamic Department / FY */}
      <div className="wrd-header__title-block">
        <div className="wrd-header__title">
          Viksit Rajya Institution For Transformation
        </div>
        <div className="wrd-header__subtitle">
          Water Resource Department{selectedFY ? `, ${selectedFY}` : ''}
        </div>
      </div>

      {/* Right: CM Portrait / Official Profile */}
      <div className="wrd-header__right">
        <img
          src="/vikistrajyalogo.png"
          alt="CM Portrait"
          className="wrd-header__cm-photo"
        />
      </div>
    </header>
  )
}
