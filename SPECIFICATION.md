# 📜 Dashboard Specification Reference

DashGen Pro dashboards are defined by the `DashboardSpec` object. This document describes the structure and available options.

## Root Properties

| Property | Type | Description |
| :--- | :--- | :--- |
| `version` | `string` | Must be `"1.0"`. |
| `meta` | `Object` | Metadata including `title`, `description`, and `author`. |
| `theme` | `Object` | Visual settings: `mode` (light/dark), `accent` (hex), `density`. |
| `dataSources` | `Array` | List of data providers (Inline, API, or CSV). |
| `filters` | `Array` | Global interactive filters. |
| `sections` | `Array` | Layout containers for widgets. |

---

## Data Sources

Data sources provide the raw arrays of objects used by widgets.

### Inline Data
```json
{
  "id": "my_data",
  "type": "inline",
  "data": [{ "label": "A", "value": 10 }, { "label": "B", "value": 20 }]
}
```

### Remote API
```json
{
  "id": "external_api",
  "type": "api",
  "url": "https://api.example.com/metrics"
}
```

---

## Widgets

### KPI Widget
Displays a single highlighted metric.
- `field`: The data key to display.
- `prefix/suffix`: Strings to wrap the value.
- `precision`: Number of decimal places.

### Chart Widget
Uses Recharts for visualization.
- `chartType`: `line`, `bar`, `area`, or `pie`.
- `xAxis`: Data key for the horizontal axis.
- `yAxis`: Array of data keys for series.

### Table Widget
Interactive data grid.
- `columns`: Array of `{ key, label, format }`.
- `pageSize`: Number of rows per page.

---

## The Query Engine

Widgets can transform data before rendering using the `query` object:

```json
"query": {
  "groupBy": "category",
  "aggregate": {
    "amount": "sum"
  },
  "orderBy": "amount",
  "order": "desc",
  "limit": 5
}
```

Available Aggregations: `sum`, `avg`, `count`, `min`, `max`.