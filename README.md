# 📊 DashGen Pro

**DashGen Pro** is a high-fidelity, schema-driven dashboard generator. It empowers developers and analysts to build enterprise-grade, responsive data visualizations using a simple JSON specification.

## 🚀 Key Features

- **Schema-Driven UI**: Define your entire dashboard in a single JSON file. Validated by Zod for 100% type safety.
- **Dynamic Data Engine**: Native support for Inline JSON, Remote APIs, and CSV uploads with client-side aggregation and filtering.
- **Responsive Layouts**: Intelligent grid system that adapts from mobile to 4K displays.
- **Rich Widget Library**: KPIs, Charts (Line, Bar, Area, Pie), Tables, Timelines, and Alerts.
- **Theming & Customization**: Built-in support for Dark/Light modes, accent colors, and density controls.
- **Collaboration Ready**: Generate shareable, base64-encoded URLs for instant dashboard sharing.
- **Print Optimized**: One-click PDF export with specialized print CSS.

## 🛠 Tech Stack

- **Framework**: React 19 (ESM)
- **State Management**: Zustand (Atomic updates)
- **Validation**: Zod (Runtime schema enforcement)
- **Visualization**: Recharts (SVG-based responsive charts)
- **Styling**: Tailwind CSS
- **Testing**: Vitest (Unit testing)

## 🏁 Quick Start

1. **Browse Templates**: Click the "Templates" button in the header to load a pre-configured dashboard.
2. **Edit JSON**: Switch to the **EDITOR** tab to modify the specification in real-time.
3. **Connect Data**: Update the `dataSources` array to point to your own API endpoints or upload a CSV.
4. **Share**: Click **SHARE** to copy a unique URL to your clipboard.

## 📖 Documentation

- [Specification Guide](./SPECIFICATION.md): Full reference for the DashboardSpec JSON.
- [Architecture Guide](./ARCHITECTURE.md): Deep dive into the data flow and rendering engine.

---
Built with ❤️ for High-Performance Data Teams.