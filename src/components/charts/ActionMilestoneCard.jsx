import React from 'react'
import { AlertCircle } from 'lucide-react'

export default function ActionMilestoneCard({ title, targetFY }) {
  return (
    <div className="wrd-action-card">
      <div className="wrd-action-card__text">
        {title}
      </div>
      <div className="wrd-action-card__footer">
        <div className="wrd-action-card__badge">
          <AlertCircle size={14} color="#d97706" fill="#fef3c7" />
        </div>
        <div className="wrd-action-card__year">
          {targetFY}
        </div>
      </div>
    </div>
  )
}
