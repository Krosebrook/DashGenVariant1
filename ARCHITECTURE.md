# 🏗 Architecture Overview

DashGen Pro follows a unidirectional data flow pattern designed for high performance and low latency.

## 1. State Management (`store.ts`)
We use **Zustand** for a lightweight, reactive store. The store manages:
- The current `DashboardSpec`.
- A `dataCache` containing resolved data from all sources.
- `activeFilters` representing the user's current selections.

## 2. Data Engine (`dataEngine.ts`)
This is the "brain" of the application. It handles:
- **Resolution**: Fetching API data or parsing CSV content.
- **Transformation**: Applying global filters and widget-specific queries (Grouping, Aggregating, Sorting) entirely on the client side.

## 3. Rendering Pipeline (`DashboardRenderer.tsx`)
1. The Renderer iterates through `sections`.
2. For each `widget`, it requests processed data from the `DataEngine`.
3. It passes this data to specialized widget components (`ChartWidget`, `KPIWidget`, etc.).
4. Widgets use **Recharts** or standard React patterns to draw the UI.

## 4. Validation Layer (`types.ts`)
Every specification is validated against **Zod** schemas before being applied. This prevents the application from crashing due to malformed JSON and provides helpful error messages in the Editor.