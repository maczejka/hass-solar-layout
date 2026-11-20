# Solar Layout

A custom Home Assistant Lovelace card that shows your solar panels as modules — aluminium frame, cell grid, glass sheen —
that take on a gradient colour and start to glow the more they produce. A header sums up the array (total, per-group
totals, average, best / weakest panel, how many report), weak panels are flagged against their group's median, and a
legend explains the colours. Tap a panel for its history.

<img width="1390" height="665" alt="image" src="https://github.com/user-attachments/assets/895018b8-14ff-43ef-b8db-abb36bbcefd8" />

## Installation

### HACS (recommended)

1. Open HACS in your Home Assistant instance.
2. Go to **Frontend** → three-dot menu → **Custom repositories**.
3. Add this repository URL, category **Plugin**.
4. Install "Solar Layout" and restart Home Assistant.

### Manual

1. Download `hass-solar-layout.js` from the [latest release](../../releases/latest).
2. Copy it to `config/www/hass-solar-layout.js`.
3. Add the resource in **Settings → Dashboards → Resources**:
   - URL: `/local/hass-solar-layout.js`
   - Type: JavaScript Module

## Configuration

Add the card via the UI card picker (search "Solar Layout") or manually in YAML:

```yaml
type: custom:mac-solar-layout
layout:
  - [sensor.panel_1, sensor.panel_2, sensor.panel_3]
  - [sensor.panel_4, sensor.panel_5, sensor.panel_6]
colors:
  - color: "#00bfff"
    value: 0
  - color: "#ffd700"
    value: 200
  - color: "#ff8c00"
    value: 600
title: PV modules
group_names: [Roof, Balcony]
```

### Options

| Key | Type | Default | Description |
|---|---|---|---|
| `layout` | `string[][]` | required | 2D grid of entity IDs. Use `_` for empty cells. |
| `colors` | `{color, value}[]` | required | Gradient color stops mapped to sensor values. |
| `size` | `{width?, height?}` | — | `width`: fixed card width. `height`: maximum height of the panel grid (the grid shrinks to fit). Omit to fill the container. |
| `title` | `string` | — | Title in the summary header. |
| `show_summary` | `boolean` | `true` | Header with total, group totals, average, max/min, active count, weak panels. |
| `show_legend` | `boolean` | `true` | Colour legend below the panels. |
| `show_values` | `boolean` | `true` | Value printed on each panel. |
| `aspect_ratio` | `number` | `1` | Panel width / height, e.g. `0.6` for portrait modules. |
| `outlier_threshold` | `number` | `0.7` | Flag a panel delivering less than this share of its group's median (`0` = off). |
| `group_names` | `string[]` | — | Names of the panel groups (top to bottom). Groups are separated by rows that contain only `_`. |

## Visual Editor

The card includes a full visual editor accessible from the card configuration panel:

- **Layout** — paint entities onto a grid with a brush selector
- **Color gradient** — add/remove color stops with a live gradient preview
- **Size** — toggle between fit-container and fixed pixel dimensions
- **Display** — title, summary / legend / values on or off, panel aspect ratio, weak-panel threshold, group names

## License

MIT
