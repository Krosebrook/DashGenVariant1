
import { Query, DataSource } from './types';

/**
 * Executes a query against a dataset locally.
 */
export function executeQuery(data: any[], query?: Query, filters: Record<string, any> = {}, specFilters: any[] = []): any[] {
  if (!data) return [];
  let result = [...data];

  // 1. Apply Global Filters
  Object.entries(filters).forEach(([filterId, value]) => {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && value.length === 0)) return;
    
    const filterConfig = specFilters.find(f => f.id === filterId);
    if (!filterConfig) return;

    const field = filterConfig.field;
    if (filterConfig.type === 'search') {
      result = result.filter(item => 
        String(item[field]).toLowerCase().includes(String(value).toLowerCase())
      );
    } else if (filterConfig.type === 'date') {
      // Expecting value to be { start?: string, end?: string }
      if (typeof value === 'object') {
        if (value.start) {
          result = result.filter(item => new Date(item[field]) >= new Date(value.start));
        }
        if (value.end) {
          result = result.filter(item => new Date(item[field]) <= new Date(value.end));
        }
      } else {
        // Fallback for exact match if single string passed
        result = result.filter(item => item[field] === value);
      }
    } else if (filterConfig.type === 'multi-select') {
      if (Array.isArray(value)) {
        result = result.filter(item => value.includes(item[field]));
      }
    } else {
      result = result.filter(item => item[field] === value);
    }
  });

  // 2. Apply Widget Where Clause
  if (query?.where) {
    result = result.filter(item => {
      return Object.entries(query.where!).every(([k, v]) => item[k] === v);
    });
  }

  // 3. Aggregation & GroupBy
  if (query?.groupBy) {
    const groups: Record<string, any> = {};
    result.forEach(item => {
      const key = String(item[query.groupBy!]);
      if (!groups[key]) {
        groups[key] = { [query.groupBy!]: key };
        if (query.aggregate) {
          Object.keys(query.aggregate).forEach(field => {
            groups[key][field] = 0;
            if (query.aggregate![field] === 'min') groups[key][field] = Infinity;
            if (query.aggregate![field] === 'max') groups[key][field] = -Infinity;
          });
        }
      }

      if (query.aggregate) {
        Object.entries(query.aggregate).forEach(([field, type]) => {
          const val = Number(item[field]) || 0;
          switch (type) {
            case 'sum': groups[key][field] += val; break;
            case 'avg': groups[key][field] += val; break; 
            case 'count': groups[key][field] += 1; break;
            case 'min': groups[key][field] = Math.min(groups[key][field], val); break;
            case 'max': groups[key][field] = Math.max(groups[key][field], val); break;
          }
        });
      }
    });
    result = Object.values(groups);
  }

  // 4. Order By
  if (query?.orderBy) {
    result.sort((a, b) => {
      const valA = a[query.orderBy!];
      const valB = b[query.orderBy!];
      return query.order === 'desc' ? (valA > valB ? -1 : 1) : (valA > valB ? 1 : -1);
    });
  }

  // 5. Limit
  if (query?.limit) {
    result = result.slice(0, query.limit);
  }

  return result;
}

/**
 * Resolves a DataSource into an array of records.
 */
export async function resolveDataSource(ds: DataSource): Promise<any[]> {
  if (ds.type === 'inline') return ds.data;
  
  if (ds.type === 'csv') {
    if (ds.content) return parseCSV(ds.content);
    if (ds.url) {
      try {
        const resp = await fetch(ds.url);
        if (!resp.ok) throw new Error(`CSV fetch failed: ${resp.statusText}`);
        const text = await resp.text();
        return parseCSV(text);
      } catch (e) {
        console.error(`Failed to load CSV source ${ds.id}`, e);
        return [];
      }
    }
  }

  if (ds.type === 'api') {
    try {
      const resp = await fetch(ds.url);
      if (!resp.ok) throw new Error(`API fetch failed: ${resp.statusText}`);
      return await resp.json();
    } catch (e) {
      console.error(`Failed to load API source ${ds.id}`, e);
      return [];
    }
  }

  return [];
}

function parseCSV(text: string): any[] {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  const headers = lines[0].split(',').map(h => h.trim());
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return headers.reduce((obj: any, header, i) => {
      const val = values[i]?.trim();
      obj[header] = isNaN(Number(val)) ? val : Number(val);
      return obj;
    }, {});
  });
}
