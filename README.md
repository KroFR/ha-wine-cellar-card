# 🍷 Wine Cellar Card

A custom Lovelace card for [Home Assistant](https://www.home-assistant.io/) that displays your **Haier hOn wine cellar** at a glance. It shows temperature and humidity for two independent zones, plus mode, program, light status, and error alerts.

| Light Theme | Dark Theme |
|---|---|
| <img width="500" height="328" alt="image" src="https://github.com/user-attachments/assets/8fc2d94e-2cc0-4119-a867-ff2b05f59eff" /> | <img width="500" height="328" alt="image" src="https://github.com/user-attachments/assets/5636f2a9-da36-47e8-a9ad-085ddd6d8f84" /> |

## ✨ Features
- Adaptive cellar illustration (mono-zone / dual-zone)
- Mono-zone / Dual-zone temperature rings with target values
- Humidity, mode, and program display
- Light status and error banner
- Configurable illustration position and hidden-state support
- Light and Dark mode support
- Multilingual support and auto-detection (English, French, Spanish, Italian, Portuguese, German, Dutch)
- Visual editor: fully configurable through the Lovelace UI editor, no YAML required.

## ℹ️ Prerequisites 

This card was built to pair with the [hOn integration](https://github.com/gvigroux/hon), which exposes Haier wine cellars in Home Assistant. That said, it's not locked to that integration. As long as your entities use the same types (a binary sensor for status, sensors for temperature/humidity, etc.), the card will work with any integration that exposes them.

## 🧪 Model tested

- Haier hOn HWS42GDAU1

## 📦 Installation

### HACS (recommended)
1. Open **HACS** in Home Assistant.
2. Click on the three dots in the top right corner
3. Select "Custom repositories"
4. Add this repository URL `https://github.com/KroFR/hon-wine-cellar-ha-card`
5. Select "Dashboard"
6. Click "Add"
7. Search for "Wine Cellar Card" and install it

### Manual
1. Download `wine-cellar-card.js` from the `dist` folder of this repository.
2. Copy it to `www/community/wine-cellar-card/wine-cellar-card.js` in your Home Assistant instance.
3. Go to **Settings** > **Dashboards** > three-dot menu > **Resources**.
4. Select **Add resource**, set the URL to `/hacsfiles/wine-cellar-card/wine-cellar-card.js?v=1`, and set resource type to **JavaScript module**.
5. Refresh your browser.

## Adding the card

1. Edit any dashboard and select **Add Card**.
2. Search for **Wine Cellar Card**, or select **Manual** and use the YAML shown below.
3. Configure the entities either through the visual editor or directly in YAML.

## ⚙️ Configuration

| Name | Type | Required | Default | Description |
|---|---|---|---|---|
| `type` | string | yes | — | `custom:wine-cellar-card` |
| `status_entity` | string | yes | — | Binary sensor for on/off state |
| `name` | string | no | Wine cellar | Card title |
| `language` | string | no | auto | `en`, `fr`, `es`, `it`, `pt`, `de`, `nl`. Leave empty to auto-detect from your Home Assistant profile |
| `error_entity` | string | no | — | Sensor reporting error codes |
| `light_entity` | string | no | — | Light, switch or binary entity for the cellar light |
| `env_temp_entity` | string | no | — | Room temperature sensor |
| `mode_entity` | string | no | — | Sensor for the mode |
| `mode_names` | map | no | — | Maps raw mode values to display labels |
| `program_name_entity` | string | no | — | Sensor for the active program name |
| `cellar_visual_position` | string | no | `left` | Define illustration position `left`, `center`, or `right` |
| `hide_cellar_visual` | boolean | no | `false` | Hide the illustration and enlarge the zones |
| `zone1_label` / `zone2_label` | string | no | `ZONE 1` / `ZONE 2` | Zone display name |
| `zone1_temp_entity` / `zone2_temp_entity` | string | no | — | Zone temperature sensor |
| `zone1_target_entity` / `zone2_target_entity` | string | no | — | Zone target temperature sensor |
| `zone1_humidity_entity` / `zone2_humidity_entity` | string | no | — | Zone humidity sensor |
| `zone1_min` / `zone2_min` | number | no | `0` | Minimum temperature for the ring gauge |
| `zone1_max` / `zone2_max` | number | no | `20` | Maximum temperature for the ring gauge |

## 📝 Usage examples

### Full dual-zone setup
The complete configuration, with both zones, custom zone name, mode mapping, and program display.

| Light Theme | Dark Theme |
|---|---|
| <img width="500" height="328" alt="image" src="https://github.com/user-attachments/assets/32319494-b5ab-4f22-a6cc-0f4a5d6f850f" /> | <img width="500" height="328" alt="image" src="https://github.com/user-attachments/assets/a79d34d9-85b1-4def-b2fc-41f24fc34006" /> |

```yaml
type: custom:wine-cellar-card
name: Wine cellar
status_entity: binary_sensor.wine_cellar_status
error_entity: sensor.wine_cellar_error
light_entity: light.wine_cellar_light
env_temp_entity: sensor.wine_cellar_environment_temperature
mode_entity: sensor.wine_cellar_mode
mode_names:
  '0': '-'
  '1': Standard
  '2': Eco
program_name_entity: sensor.wine_cellar_program_name
zone1_label: White & Champagne
zone1_temp_entity: sensor.wine_cellar_temperature
zone1_target_entity: sensor.wine_cellar_selected_temperature
zone1_humidity_entity: sensor.wine_cellar_humidity_zone_1
zone1_min: 0
zone1_max: 20
zone2_label: Red
zone2_temp_entity: sensor.wine_cellar_temperature_zone_2
zone2_target_entity: sensor.wine_cellar_selected_temperature_zone_2
zone2_humidity_entity: sensor.wine_cellar_humidity_zone_2
zone2_min: 0
zone2_max: 20
cellar_visual_position: center
```

### Minimal setup
Only the required entity, everything else falls back to defaults.

| Light Theme | Dark Theme |
|---|---|
| <img width="500" height="249" alt="image" src="https://github.com/user-attachments/assets/ebc51582-91f2-476e-8313-9fca18ed18c2" /> | <img width="500" height="249" alt="image" src="https://github.com/user-attachments/assets/eb40d685-12e6-4450-9af5-c5026a9517b2" /> |

```yaml
type: custom:wine-cellar-card
status_entity: binary_sensor.wine_cellar_status
```

### Single-zone cellar
Leave zone 2 fields empty and the card hides that panel automatically.

| Light Theme | Dark Theme |
|---|---|
| <img width="500" height="249" alt="image" src="https://github.com/user-attachments/assets/0c9570e4-33c6-432d-8355-adc35d1af16b" /> | <img width="500" height="249" alt="image" src="https://github.com/user-attachments/assets/712ae04d-1990-472c-bb1f-c8387df34e79" /> |

```yaml
type: custom:wine-cellar-card
name: Wine cellar
status_entity: binary_sensor.wine_cellar_status
zone1_label: Red Wine
zone1_temp_entity: sensor.wine_cellar_temperature
zone1_target_entity: sensor.wine_cellar_selected_temperature
zone1_humidity_entity: sensor.wine_cellar_humidity_zone_1
zone1_min: 5
zone1_max: 20
```

### Compact layout without illustration
Hide the cellar illustration to give more room to the temperature rings, ideal for narrow dashboard columns.

| Light Theme | Dark Theme |
|---|---|
| <img width="500" height="262" alt="image" src="https://github.com/user-attachments/assets/5836df75-74d1-48ab-81e3-62326edc3823" /> | <img width="500" height="262" alt="image" src="https://github.com/user-attachments/assets/620660b2-06b5-4f36-a23f-0cb179b66ec6" />
 |

```yaml
type: custom:wine-cellar-card
status_entity: binary_sensor.wine_cellar_status
zone1_temp_entity: sensor.wine_cellar_temperature
zone1_target_entity: sensor.wine_cellar_selected_temperature
zone1_humidity_entity: sensor.wine_cellar_humidity_zone_1
zone2_temp_entity: sensor.wine_cellar_temperature_zone_2
zone2_target_entity: sensor.wine_cellar_selected_temperature_zone_2
zone2_humidity_entity: sensor.wine_cellar_humidity_zone_2
hide_cellar_visual: true
```

### Illustration on the right, forced language
Move the illustration to the right side and force French regardless of your Home Assistant profile language.

| Light Theme | Dark Theme |
|---|---|
| <img width="500" height="247" alt="image" src="https://github.com/user-attachments/assets/44b9232c-7eb4-4485-8a6c-7e3661379099" /> | <img width="500" height="247" alt="image" src="https://github.com/user-attachments/assets/32ade07b-2138-4ff0-84b8-a7f10e98281f" /> |

```yaml
type: custom:wine-cellar-card
status_entity: binary_sensor.wine_cellar_status
zone1_temp_entity: sensor.wine_cellar_temperature
zone1_target_entity: sensor.wine_cellar_selected_temperature
zone1_humidity_entity: sensor.wine_cellar_humidity_zone_1
zone2_temp_entity: sensor.wine_cellar_temperature_zone_2
zone2_target_entity: sensor.wine_cellar_selected_temperature_zone_2
zone2_humidity_entity: sensor.wine_cellar_humidity_zone_2
hide_cellar_visual: false
cellar_visual_position: right
language: fr
```

## 📄 License

[<img width="78" height="20" alt="image" src="https://github.com/user-attachments/assets/c14c93d7-50c2-4726-9a47-77f6c466e5b5" />](https://github.com/KroFR/hon-wine-cellar-ha-card/blob/main/LICENSE)
