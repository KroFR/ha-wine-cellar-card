# 🍷 Wine Cellar Card

A custom Lovelace card for Home Assistant that displays your **Haier hOn wine cellar** at a glance. It shows temperature and humidity for two independent zones, plus mode, program, light status, and error alerts.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="330" alt="image" src="https://github.com/user-attachments/assets/840be4ef-15c9-4b36-be2e-c99e067c879a" /> | <img width="501" height="330" alt="image" src="https://github.com/user-attachments/assets/4a9c36b9-6ecf-4afa-8108-4063eb94a3a3" /> |

### ✨ Features
- Dual-zone temperature rings with target values
- Humidity, mode, and program display
- Light toggle and error banner
- Configurable illustration position and hidden-state support
- Light and Dark mode support
- Multilingual support and auto-detection (English, French, Spanish, Italian, Portuguese, German, Dutch)

### ℹ️ Prerequisites 

This card was built to pair with the [hOn integration](https://github.com/gvigroux/hon), which exposes Haier wine cellars in Home Assistant. That said, it's not locked to that integration. As long as your entities use the same types (a binary sensor for status, sensors for temperature/humidity, etc.), the card will work with any integration that exposes them.

Tested with Wine Cellar model:
- HWS42GDAU1

## 📦 Installation

### HACS (recommended)
1. Open **HACS** in Home Assistant.
2. Click on the three dots in the top right corner
3. Select "Custom repositories"
4. Add this repository URL ([https://github.com/KroFR/hon-wine-cellar-ha-card](https://github.com/KroFR/hon-wine-cellar-ha-card))
5. Select "Dashboard"
6. Click "Add"
7. Search for "Wine Cellar Card" and install it

### Manual
1. Download `wine-cellar-card.js` from the `dist` folder of this repository.
2. Copy it to `www/community/wine-cellar-card/wine-cellar-card.js` in your Home Assistant instance.
3. Go to **Settings** > **Dashboards** > three-dot menu > **Resources**.
4. Select **Add resource**, set the URL to `/hacsfiles/wine-cellar-card/wine-cellar-card.js?v=1`, and set resource type to **JavaScript module**.
5. Refresh your browser.

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
| `zone1_min` / `zone2_min` | number | no | `5` | Minimum temperature for the ring gauge |
| `zone1_max` / `zone2_max` | number | no | `20` | Maximum temperature for the ring gauge |

## 📝 Usage examples

### Full dual-zone setup
The complete configuration, with both zones, mode mapping, and program display.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="330" alt="image" src="https://github.com/user-attachments/assets/840be4ef-15c9-4b36-be2e-c99e067c879a" /> | <img width="501" height="330" alt="image" src="https://github.com/user-attachments/assets/4a9c36b9-6ecf-4afa-8108-4063eb94a3a3" /> |

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
zone1_min: 5
zone1_max: 20
zone2_label: Red
zone2_temp_entity: sensor.wine_cellar_temperature_zone_2
zone2_target_entity: sensor.wine_cellar_selected_temperature_zone_2
zone2_humidity_entity: sensor.wine_cellar_humidity_zone_2
zone2_min: 5
zone2_max: 20
cellar_visual_position: center
```

### Minimal setup
Only the required entity, everything else falls back to defaults.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/ba4705d3-9da3-4abf-a0ef-581eb4f69b22" /> | <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/c4826f7d-e7fb-4f95-9c6e-92a6fcb9f5f7" /> |

```yaml
type: custom:wine-cellar-card
status_entity: binary_sensor.wine_cellar_status
```

### Single-zone cellar
Leave zone 2 fields empty and the card hides that panel automatically.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/27223180-5b8f-4145-b272-b61f3aeca8bc" /> | <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/e2f55a94-cdf5-499a-847a-a5f3cad52590" /> |

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
| <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/0f867418-5f91-4525-9b9b-595b38e77832" /> | <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/0175e388-0f7f-4f58-8ae1-cc824a939be3" /> |

```yaml
type: custom:wine-cellar-card
status_entity: binary_sensor.wine_cellar_status
zone1_temp_entity: sensor.wine_cellar_temperature
zone1_target_entity: sensor.wine_cellar_selected_temperature
zone1_humidity_entity: sensor.wine_cellar_humidity_zone_1
zone1_min: 5
zone1_max: 20
zone2_temp_entity: sensor.wine_cellar_temperature_zone_2
zone2_min: 5
zone2_max: 20
zone2_target_entity: sensor.wine_cellar_selected_temperature_zone_2
zone2_humidity_entity: sensor.wine_cellar_humidity_zone_2
hide_cellar_visual: true
```

### Illustration on the right, forced language
Move the illustration to the right side and force French regardless of your Home Assistant profile language.

| Light Theme | Dark Theme |
|---|---|
| <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/14a8ed62-ebeb-4992-bbcc-e4a94209583b" /> | <img width="501" height="250" alt="image" src="https://github.com/user-attachments/assets/9d6cd1a5-64f9-4fef-a8d6-c75088e2fa2c" /> |

```yaml
type: custom:wine-cellar-card
status_entity: binary_sensor.wine_cellar_status
zone1_temp_entity: sensor.wine_cellar_temperature
zone1_target_entity: sensor.wine_cellar_selected_temperature
zone1_humidity_entity: sensor.wine_cellar_humidity_zone_1
zone1_min: 5
zone1_max: 20
zone2_temp_entity: sensor.wine_cellar_temperature_zone_2
zone2_min: 5
zone2_max: 20
zone2_target_entity: sensor.wine_cellar_selected_temperature_zone_2
zone2_humidity_entity: sensor.wine_cellar_humidity_zone_2
hide_cellar_visual: false
cellar_visual_position: right
language: fr
```

## 📄 License

[<img width="78" height="20" alt="image" src="https://github.com/user-attachments/assets/c14c93d7-50c2-4726-9a47-77f6c466e5b5" />](https://github.com/KroFR/hon-wine-cellar-ha-card/blob/main/LICENSE)
