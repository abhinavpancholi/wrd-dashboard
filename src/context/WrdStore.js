import { create } from 'zustand'

/**
 * WRD Dashboard Store — Zustand
 * Sourced from wrdConfig.json, wrd_kpis.json, wrd_districts.json, gujarat.json
 */
const useWrdStore = create((set, get) => ({
  // State
  loading: true,
  error: null,
  config: null,
  kpiData: null,
  districts: [],
  gujaratTopo: null,

  // Filters
  selectedFY: '2026-27',
  selectedDistrict: null,

  // Actions
  initData: async () => {
    try {
      set({ loading: true, error: null })

      const [configRes, kpiRes, distRes, topoRes] = await Promise.all([
        fetch('/data/wrdConfig.json'),
        fetch('/data/wrd_kpis.json'),
        fetch('/data/wrd_districts.json'),
        fetch('/data/gujarat.json')
      ])

      if (!configRes.ok || !kpiRes.ok || !distRes.ok || !topoRes.ok) {
        throw new Error('Failed to load WRD dashboard data files')
      }

      const [config, kpiData, districts, gujaratTopo] = await Promise.all([
        configRes.json(),
        kpiRes.json(),
        distRes.json(),
        topoRes.json()
      ])

      set({
        config,
        kpiData,
        districts,
        gujaratTopo,
        loading: false
      })
    } catch (err) {
      console.error('WRD Store initialization error:', err)
      set({ error: err.message, loading: false })
    }
  },

  setFY: (fy) => set((state) => ({
    selectedFY: state.selectedFY === fy ? '2026-27' : fy
  })),

  setDistrict: (district) => set((state) => ({
    selectedDistrict: state.selectedDistrict === district ? null : district
  })),

  resetFilters: () => set({
    selectedFY: '2026-27',
    selectedDistrict: null
  })
}))

export default useWrdStore
