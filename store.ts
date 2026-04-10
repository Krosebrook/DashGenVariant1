
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
  errors: Record<string, string>;
  user: { id: number, email: string } | null;
  token: string | null;
  setSpec: (spec: DashboardSpec) => void;
  setFilter: (id: string, value: any) => void;
  loadData: () => Promise<void>;
  updateInlineData: (dataSourceId: string, newData: any[]) => void;
  setReadOnly: (readOnly: boolean) => void;
  login: (user: { id: number, email: string }, token: string) => void;
  logout: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  spec: EXECUTIVE_DASHBOARD,
  activeFilters: {},
  dataCache: {},
  isLoading: false,
  isReadOnly: false,
  errors: {},
  user: null,
  token: localStorage.getItem('token'),
  setSpec: (spec) => {
    set({ spec, activeFilters: {}, dataCache: {}, errors: {} });
    get().loadData();
  },
  setFilter: (id, value) => set((state) => ({ 
    activeFilters: { ...state.activeFilters, [id]: value } 
  })),
  setReadOnly: (isReadOnly) => set({ isReadOnly }),
  login: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null });
  },
  loadData: async () => {
    const { spec } = get();
    set({ isLoading: true, errors: {} });
    const newCache: Record<string, any[]> = {};
    const newErrors: Record<string, string> = {};
    
    await Promise.all(spec.dataSources.map(async (ds) => {
      try {
        newCache[ds.id] = await resolveDataSource(ds);
      } catch (err: any) {
        console.error(`Failed to load data source ${ds.id}:`, err);
        newCache[ds.id] = [];
        newErrors[ds.id] = err.message || 'Failed to load data';
      }
    }));
    
    set({ dataCache: newCache, errors: newErrors, isLoading: false });
  },
  updateInlineData: (dataSourceId, newData) => {
    const { spec } = get();
    const newSources = spec.dataSources.map(ds => 
      ds.id === dataSourceId && ds.type === 'inline' ? { ...ds, data: newData } : ds
    );
    get().setSpec({ ...spec, dataSources: newSources as any });
  }
}));
