
import { describe, it, expect } from 'vitest';
import { DashboardSpecSchema } from '../types';

describe('Dashboard Specification Validation', () => {
  it('validates a correct executive dashboard spec', () => {
    const validSpec = {
      version: '1.0',
      meta: { title: 'Test' },
      theme: { mode: 'light', accent: '#000', density: 'cozy' },
      dataSources: [],
      sections: []
    };
    const result = DashboardSpecSchema.safeParse(validSpec);
    expect(result.success).toBe(true);
  });

  it('fails on missing required fields', () => {
    const invalidSpec = { version: '1.0' };
    const result = DashboardSpecSchema.safeParse(invalidSpec);
    expect(result.success).toBe(false);
  });
});
