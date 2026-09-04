# 🍷 Wine Cellar Card

A custom Lovelace card for [Home Assistant](https://www.home-assistant.io/) that displays your **Haier hOn wine cellar** at a glance. It shows temperature and humidity for two independent zones, plus mode, program, light status, and error alerts.

| Light Theme | Dark Theme |
|---|---|
| <img width="503" height="331" alt="image" src="https://github.com/user-attachments/assets/3a9b9648-97eb-407f-a710-3926a6e02751" /> | <img width="501" height="330" alt="image" src="https://github.com/user-attachments/assets/b51619d9-ca54-41d4-a9cf-bcbb72c3bc3f" /> |

### ✨ Features
- Adaptive cellar illustration (mono-zone / dual-zone)
- mono-zone / Dual-zone temperature rings with target values
- Humidity, mode, and program display
- Light toggle and error banner
- Configurable illustration position and hidden-state support
- Light and Dark mode support
- Multilingual support and auto-detection (English, French, Spanish, Italian, Portuguese, German, Dutch)
- Visual editor: fully configurable through the Lovelace UI editor, no YAML required.

### ℹ️ Prerequisites 

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
The complete configuration, with both zones, mode mapping, and program display.

| Light Theme | Dark Theme |
|---|---|
| <img width="504" height="330" alt="image" src="https://github.com/user-attachments/assets/d2f39b3b-34fc-427b-b498-ec4db1fd7b51" /> | <img width="505" height="332" alt="image" src="https://github.com/user-attachments/assets/b0416e14-4047-42da-b587-a4594b264831" /> |

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
zone1_min: O
zone1_max: 20
zone2_label: Red
zone2_temp_entity: sensor.wine_cellar_temperature_zone_2
zone2_target_entity: sensor.wine_cellar_selected_temperature_zone_2
zone2_humidity_entity: sensor.wine_cellar_humidity_zone_2
zone2_min: O
zone2_max: 20
cellar_visual_position: center
```

### Minimal setup
Only the required entity, everything else falls back to defaults.

| Light Theme | Dark Theme |
|---|---|
| <img width="482" height="249" alt="image" src="https://github.com/user-attachments/assets/eda1250b-57ca-41be-9e63-e45e1a28e069" /> | <img width="482" height="249" alt="image" src="https://github.com/user-attachments/assets/9bd9f673-246c-463c-91b9-8d634ae72213" /> |

```yaml
type: custom:wine-cellar-card
status_entity: binary_sensor.wine_cellar_status
```

### Single-zone cellar
Leave zone 2 fields empty and the card hides that panel automatically.

| Light Theme | Dark Theme |
|---|---|
| <img width="503" height="249" alt="image" src="https://github.com/user-attachments/assets/893bd615-23b5-471b-8f03-a2fb6adcbdba" /> | <img width="503" height="249" alt="image" src="https://github.com/user-attachments/assets/ad0db335-b20b-40b9-a9c8-0fdc53f2181c" /> |

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
| <img width="503" height="249" alt="image" src="https://github.com/user-attachments/assets/0d04051a-67d2-40be-ba5f-4df24aaa5ae4" /> | <img width="503" height="249" alt="image" src="https://github.com/user-attachments/assets/a5df4766-c98f-4ec3-8dd6-346dbcf619a6" /> |

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
| <img width="502" height="250" alt="image" src="https://github.com/user-attachments/assets/861b7b3d-939d-48f3-9d0e-f5c64a9e811c" /> | <img width="502" height="250" alt="image" src="https://github.com/user-attachments/assets/aa91f693-0c49-4bf6-a650-e9a507afd6fa" /> |

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
