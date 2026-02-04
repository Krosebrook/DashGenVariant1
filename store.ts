
import { create } from 'zustand';
import { DashboardSpec, DataSource } from './types';
import { EXECUTIVE_DASHBOARD } from './constants/examples';
import { resolveDataSource } from './dataEngine';

interface DashboardState {
  spec: DashboardSpec;
  activeFilters: Record<string, any>;
  dataCache: Record<string, any[]>;
  isLoading: boolean;
  isReadOnly: boolean;
  setSpec: (spec: DashboardSpec) => void;
  setFilter: (id: string, value: any) => void;
  loadData: () => Promise<void>;
  updateInlineData: (dataSourceId: string, newData: any[]) => void;
  setReadOnly: (readOnly: boolean) => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  spec: EXECUTIVE_DASHBOARD,
  activeFilters: {},
  dataCache: {},
  isLoading: false,
  isReadOnly: false,
  setSpec: (spec) => {
    set({ spec, activeFilters: {}, dataCache: {} });
    get().loadData();
  },
  setFilter: (id, value) => set((state) => ({ 
    activeFilters: { ...state.activeFilters, [id]: value } 
  })),
  setReadOnly: (isReadOnly) => set({ isReadOnly }),
  loadData: async () => {
    const { spec } = get();
    set({ isLoading: true });
    const newCache: Record<string, any[]> = {};
    
    await Promise.all(spec.dataSources.map(async (ds) => {
      try {
        newCache[ds.id] = await resolveDataSource(ds);
      } catch (err) {
        console.error(`Failed to load data source ${ds.id}:`, err);
        newCache[ds.id] = [];
      }
    }));
    
    set({ dataCache: newCache, isLoading: false });
  },
  updateInlineData: (dataSourceId, newData) => {
    const { spec } = get();
    const newSources = spec.dataSources.map(ds => 
      ds.id === dataSourceId && ds.type === 'inline' ? { ...ds, data: newData } : ds
    );
    get().setSpec({ ...spec, dataSources: newSources as any });
  }
}));
