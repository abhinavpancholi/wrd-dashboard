import React, { useRef, useEffect, useState, useMemo } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import useWrdStore from '../../context/WrdStore'
import { formatIndian } from '../../utils/formatters'

// District name normalization map between TopoJSON and dataset
const ALIAS_MAP = {
  'BANASKANTHA': 'BANAS KANTHA',
  'SABARKANTHA': 'SABAR KANTHA',
  'AHMEDABAD': 'AHMADABAD',
  'PANCHMAHAL': 'PANCH MAHALS',
  'CHHOTAUDAIPUR': 'CHHOTAUDEPUR',
  'KUTCH': 'KACHCHH',
  'MEHSANA': 'MAHESANA',
  'ARAVALLI': 'ARVALLI',
  'DAHOD': 'DOHAD'
}

function normalizeName(name) {
  if (!name) return ''
  const clean = name.toUpperCase().replace(/[\s\-_]/g, '')
  return ALIAS_MAP[clean] || clean
}

export default function FarmersMisMap({ topoData, districtsData }) {
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 340, height: 260 })

  const { selectedFY, selectedDistrict, setDistrict } = useWrdStore()

  // Active FY for map data (default to 2025-26 if none selected)
  const activeFY = selectedFY || '2025-26'

  // Map of normalized district name -> district record for the active FY
  const { districtMap, maxVal, minVal } = useMemo(() => {
    const map = new Map()
    let max = 0
    let min = Infinity

    if (districtsData?.byFY) {
      const fyData = districtsData.byFY[activeFY] || districtsData.byFY['2025-26'] || {}
      
      Object.entries(fyData).forEach(([dName, record]) => {
        const normKey = normalizeName(dName)
        const val = record.farmers_actual > 0 ? record.farmers_actual : record.farmers_target
        if (val > max) max = val
        if (val < min) min = val
        map.set(normKey, record)
      })
    }

    if (min === Infinity) min = 0
    if (max === 0) max = 1000

    return { districtMap: map, maxVal: max, minVal: min }
  }, [districtsData, activeFY])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setDimensions({ width, height: height - 8 })
        }
      }
    })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!topoData || !svgRef.current) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const { width, height } = dimensions

    const featureCollection = topojson.feature(topoData, topoData.objects.districts)
    const projection = d3.geoMercator().fitSize([width - 16, height - 16], featureCollection)
    const pathGenerator = d3.geoPath().projection(projection)

    // Vibrant Teal/Cyan choropleth interpolator matching the Power BI screenshot
    const colorScale = d3.scaleSequential()
      .domain([0, maxVal])
      .interpolator(d3.interpolateRgbBasis([
        '#dbeafe', // very light ice blue
        '#bae6fd', // light sky blue
        '#7dd3fc', // sky blue
        '#38bdf8', // medium teal-cyan
        '#2dd4bf', // teal
        '#0d9488', // dark teal
        '#00796b'  // deep teal
      ]))

    const g = svg.append('g').attr('transform', 'translate(8, 8)')

    g.selectAll('path')
      .data(featureCollection.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', (d) => {
        const rawName = d.properties.district || ''
        const normKey = normalizeName(rawName)
        const record = districtMap.get(normKey)
        
        if (selectedDistrict && normalizeName(selectedDistrict) === normKey) {
          return '#f97316' // Active district selection highlight
        }

        if (record) {
          const val = record.farmers_actual > 0 ? record.farmers_actual : record.farmers_target
          return colorScale(val)
        }
        return '#cbd5e1'
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 0.8)
      .attr('cursor', 'pointer')
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function (event, d) {
        const rawName = d.properties.district || ''
        const normKey = normalizeName(rawName)
        const record = districtMap.get(normKey)

        if (selectedDistrict !== rawName) {
          d3.select(this)
            .attr('stroke', '#0f172a')
            .attr('stroke-width', 1.8)
        }

        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '1'
          const farmersVal = record ? (record.farmers_actual > 0 ? record.farmers_actual : record.farmers_target) : null
          const commandVal = record ? (record.command_actual > 0 ? record.command_actual : record.command_target) : null

          tooltip.innerHTML = `
            <div style="font-weight:800;font-size:0.75rem;margin-bottom:3px;color:#0f172a">${rawName}</div>
            <div style="color:#0f766e;font-size:0.7rem">
              Farmers Under MIS (${activeFY}): <strong>${farmersVal != null ? formatIndian(farmersVal) : 'N/A'}</strong>
            </div>
            <div style="color:#0284c7;font-size:0.68rem;margin-top:2px">
              Command Area: <strong>${commandVal != null ? formatIndian(commandVal, 2) : 'N/A'} Acres</strong>
            </div>
          `
        }
      })
      .on('mousemove', function (event) {
        const tooltip = tooltipRef.current
        if (tooltip && containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect()
          tooltip.style.left = `${event.clientX - rect.left + 12}px`
          tooltip.style.top = `${event.clientY - rect.top - 12}px`
        }
      })
      .on('mouseleave', function (event, d) {
        const rawName = d.properties.district || ''
        const normKey = normalizeName(rawName)
        if (selectedDistrict !== rawName) {
          d3.select(this)
            .attr('stroke', '#ffffff')
            .attr('stroke-width', 0.8)
        }
        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '0'
        }
      })
      .on('click', function (event, d) {
        const rawName = d.properties.district || ''
        setDistrict(rawName)
      })

  }, [topoData, dimensions, districtMap, maxVal, activeFY, selectedDistrict, setDistrict])

  return (
    <div className="wrd-chart-panel" style={{ flex: '1.2 1 0' }}>
      <div className="wrd-chart-panel__header">
        <div className="wrd-chart-panel__title">
          Farmers Registered Under MIS
        </div>
      </div>

      <div ref={containerRef} className="wrd-map-wrapper">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="wrd-map-svg"
        />
        <div
          ref={tooltipRef}
          style={{
            position: 'absolute',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: 6,
            padding: '6px 10px',
            fontSize: '0.72rem',
            color: '#0f172a',
            pointerEvents: 'none',
            opacity: 0,
            transition: 'opacity 0.15s',
            zIndex: 50,
            boxShadow: '0 4px 14px rgba(0,0,0,0.12)'
          }}
        />
      </div>
    </div>
  )
}
