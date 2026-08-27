import React from 'react'
import useWrdStore from '../context/WrdStore'
import TrainingIrrigationLine from '../components/charts/TrainingIrrigationLine'
import ReservoirsDamsLine from '../components/charts/ReservoirsDamsLine'
import FarmersUnderMisBar from '../components/charts/FarmersUnderMisBar'
import CommandAreaCoverageBar from '../components/charts/CommandAreaCoverageBar'
import FarmersMisMap from '../components/charts/FarmersMisMap'
import GroundWaterRechargeBar from '../components/charts/GroundWaterRechargeBar'
import CheckdamsPondsBar from '../components/charts/CheckdamsPondsBar'
import ActionMilestoneCard from '../components/charts/ActionMilestoneCard'

export default function Overview() {
  const { kpiData, gujaratTopo, districts, selectedFY } = useWrdStore()

  if (!kpiData) return null

  return (
    <div className="wrd-content-workspace">
      {/* LEFT COLUMN (3 Charts) */}
      <div className="wrd-col">
        <TrainingIrrigationLine
          data={kpiData.training}
          selectedFY={selectedFY}
        />
        <ReservoirsDamsLine
          data={kpiData.reservoirs}
          selectedFY={selectedFY}
        />
        <FarmersUnderMisBar
          data={kpiData.farmers}
          selectedFY={selectedFY}
        />
      </div>

      {/* CENTER COLUMN (Map + Command Area Coverage) */}
      <div className="wrd-col">
        <FarmersMisMap
          topoData={gujaratTopo}
          districtData={districts}
        />
        <CommandAreaCoverageBar
          data={kpiData.commandArea}
          selectedFY={selectedFY}
        />
      </div>

      {/* RIGHT COLUMN (Ground water recharge + 2 Milestones + Checkdams) */}
      <div className="wrd-col">
        <GroundWaterRechargeBar
          data={kpiData.recharge}
          selectedFY={selectedFY}
        />
        
        {/* Milestone 1 */}
        <ActionMilestoneCard
          title="Development of data platform to capture data on Surface and Ground Water levels"
          targetFY="2027-28"
        />

        {/* Milestone 2 */}
        <ActionMilestoneCard
          title="Launch Common platform to share best practices of water usage"
          targetFY="2026-27"
        />

        <CheckdamsPondsBar
          data={kpiData.checkdams}
          selectedFY={selectedFY}
        />
      </div>
    </div>
  )
}
