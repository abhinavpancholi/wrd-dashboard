import React, { useRef, useEffect, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'
import useWrdStore from '../../context/WrdStore'
import { formatIndian } from '../../utils/formatters'

export default function FarmersMisMap({ topoData, districtData }) {
  const svgRef = useRef(null)
  const tooltipRef = useRef(null)
  const containerRef = useRef(null)
  const [dimensions, setDimensions] = useState({ width: 340, height: 260 })

  const { selectedDistrict, setDistrict } = useWrdStore()

  // Build district lookup map
  const districtMap = React.useMemo(() => {
    const map = new Map()
    if (districtData) {
      districtData.forEach((d) => {
        map.set(d.name.toUpperCase(), d)
      })
    }
    return map
  }, [districtData])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect
        if (width > 0 && height > 0) {
          setDimensions({ width, height: height - 10 })
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

    const g = svg.append('g').attr('transform', 'translate(8, 8)')

    g.selectAll('path')
      .data(featureCollection.features)
      .join('path')
      .attr('d', pathGenerator)
      .attr('fill', (d) => {
        const dName = (d.properties.district || '').toUpperCase()
        if (selectedDistrict && selectedDistrict === dName) {
          return '#60a5fa'
        }
        return '#cbd5e1'
      })
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1)
      .attr('cursor', 'pointer')
      .style('transition', 'all 0.15s ease')
      .on('mouseenter', function (event, d) {
        const dName = (d.properties.district || '').toUpperCase()
        if (selectedDistrict !== dName) {
          d3.select(this).attr('fill', '#94a3b8').attr('stroke', '#0f172a').attr('stroke-width', 1.5)
        }
        const data = districtMap.get(dName)
        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '1'
          tooltip.innerHTML = `
            <div style="font-weight:700;margin-bottom:2px;color:#0f172a">${d.properties.district}</div>
            <div style="color:#0284c7;font-size:0.7rem">
              Farmers Under MIS: <strong>${data ? formatIndian(data.total_farmers) : 'N/A'}</strong>
            </div>
            <div style="color:#059669;font-size:0.7rem">
              Command Area: <strong>${data ? formatIndian(data.total_command, 2) : 'N/A'} Acres</strong>
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
        const dName = (d.properties.district || '').toUpperCase()
        if (selectedDistrict !== dName) {
          d3.select(this).attr('fill', '#cbd5e1').attr('stroke', '#ffffff').attr('stroke-width', 1)
        }
        const tooltip = tooltipRef.current
        if (tooltip) {
          tooltip.style.opacity = '0'
        }
      })
      .on('click', function (event, d) {
        const dName = (d.properties.district || '').toUpperCase()
        setDistrict(dName)
      })

  }, [topoData, dimensions, districtMap, selectedDistrict, setDistrict])

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
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
          }}
        />
      </div>
    </div>
  )
}
