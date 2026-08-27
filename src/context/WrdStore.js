import { create } from 'zustand'

/**
 * WRD Dashboard Store — Zustand
 * Default FY is 2025-26 so map has active district data.
 * Clicking selected FY again removes the filter (sets to null).
 */
const useWrdStore = create((set, get) => ({
  // State
  loading: true,
  error: null,
  config: null,
  kpiData: null,
  districtsData: null,
  gujaratTopo: null,

  // Filters
  selectedFY: '2025-26',
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

      const [config, kpiData, districtsData, gujaratTopo] = await Promise.all([
        configRes.json(),
        kpiRes.json(),
        distRes.json(),
        topoRes.json()
      ])

      set({
        config,
        kpiData,
        districtsData,
        gujaratTopo,
        selectedFY: config?.defaultFY || '2025-26',
        loading: false
      })
    } catch (err) {
      console.error('WRD Store initialization error:', err)
      set({ error: err.message, loading: false })
    }
  },

  // Toggle or set FY filter
  setFY: (fy) => set((state) => ({
    selectedFY: state.selectedFY === fy ? null : fy
  })),

  toggleFY: (fy) => set((state) => ({
    selectedFY: state.selectedFY === fy ? null : fy
  })),

  setDistrict: (district) => set((state) => ({
    selectedDistrict: state.selectedDistrict === district ? null : district
  })),

  resetFilters: () => set({
    selectedFY: '2025-26',
    selectedDistrict: null
  })
}))

export default useWrdStore
