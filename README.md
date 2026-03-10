# Solar Layout

A custom Home Assistant Lovelace card that displays a color-coded grid of solar panel entities. Each cell maps to an HA sensor and is colored based on a configurable gradient (e.g. blue → gold → orange by watt output).

![Solar Layout card preview](https://via.placeholder.com/640x200/00bfff/fff?text=Solar+Layout+Preview)

> Replace the placeholder above with a real screenshot once the card is installed.

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
type: custom:sunbichl-solar-layout
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
size:
  width: 320
  height: 200
```

### Options

| Key | Type | Default | Description |
|---|---|---|---|
| `layout` | `string[][]` | required | 2D grid of entity IDs. Use `_` for empty cells. |
| `colors` | `{color, value}[]` | required | Gradient color stops mapped to sensor values. |
| `size` | `{width?, height?}` | — | Fixed pixel size. Omit to fill the card container. |

## Visual Editor

The card includes a full visual editor accessible from the card configuration panel:

- **Layout tab** — paint entities onto a grid with a brush selector
- **Color gradient tab** — add/remove color stops with a live gradient preview
- **Size tab** — toggle between fit-container and fixed pixel dimensions

## License

MIT
