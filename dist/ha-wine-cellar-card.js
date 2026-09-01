/**
 * Wine Cellar Card for Home Assistant
 * ====================================
 * Dual-zone Lovelace card for a Haier hOn wine cellar.
 *
 * License: MIT
 * Version: 1.0.0
 *
 */

class WineCellarCard extends HTMLElement {
  static STRINGS = {
    en: {
      name: "Wine cellar",
      badge_on: "ON",
      badge_off: "OFF",
      badge_nodata: "NO DATA",
      target: "Target",
      env_temp: "Room temperature",
      mode: "Mode",
      program: "Program",
      light_on: "Light on",
      light_off: "Light off",
      no_program: ["none", "unknown", "unavailable", ""],
      error_title: "ERROR",
      tip_light: "Cellar light",
      locale: "en-GB",
      decimal_separator: ".",
    },
    fr: {
      name: "Cave à vin",
      badge_on: "ALLUMÉE",
      badge_off: "ÉTEINTE",
      badge_nodata: "PAS DE DONNÉES",
      target: "Consigne",
      env_temp: "Température ambiante",
      mode: "Mode",
      program: "Programme",
      light_on: "Lumière allumée",
      light_off: "Lumière éteinte",
      no_program: ["none", "unknown", "unavailable", ""],
      error_title: "ERREUR",
      tip_light: "Éclairage cave",
      locale: "fr-FR",
      decimal_separator: ",",
    },
    es: {
      name: "Bodega de vinos",
      badge_on: "ENCENDIDA",
      badge_off: "APAGADA",
      badge_nodata: "SIN DATOS",
      target: "Consigna",
      env_temp: "Temperatura ambiente",
      mode: "Modo",
      program: "Programa",
      light_on: "Luz encendida",
      light_off: "Luz apagada",
      no_program: ["none", "unknown", "unavailable", ""],
      error_title: "ERROR",
      tip_light: "Luz de la bodega",
      locale: "es-ES",
      decimal_separator: ",",
    },
    it: {
      name: "Cantina vini",
      badge_on: "ACCESA",
      badge_off: "SPENTA",
      badge_nodata: "NESSUN DATO",
      target: "Obiettivo",
      env_temp: "Temperatura ambiente",
      mode: "Modalità",
      program: "Programma",
      light_on: "Luce accesa",
      light_off: "Luce spenta",
      no_program: ["none", "unknown", "unavailable", ""],
      error_title: "ERRORE",
      tip_light: "Luce cantina",
      locale: "it-IT",
      decimal_separator: ",",
    },
    pt: {
      name: "Adega de vinhos",
      badge_on: "LIGADA",
      badge_off: "DESLIGADA",
      badge_nodata: "SEM DADOS",
      target: "Alvo",
      env_temp: "Temperatura ambiente",
      mode: "Modo",
      program: "Programa",
      light_on: "Luz ligada",
      light_off: "Luz desligada",
      no_program: ["none", "unknown", "unavailable", ""],
      error_title: "ERRO",
      tip_light: "Luz da adega",
      locale: "pt-PT",
      decimal_separator: ",",
    },
    de: {
      name: "Weinkühlschrank",
      badge_on: "AN",
      badge_off: "AUS",
      badge_nodata: "KEINE DATEN",
      target: "Sollwert",
      env_temp: "Raumtemperatur",
      mode: "Modus",
      program: "Programm",
      light_on: "Licht an",
      light_off: "Licht aus",
      no_program: ["none", "unknown", "unavailable", ""],
      error_title: "FEHLER",
      tip_light: "Kellerbeleuchtung",
      locale: "de-DE",
      decimal_separator: ",",
    },
    nl: {
      name: "Wijnkelder",
      badge_on: "AAN",
      badge_off: "UIT",
      badge_nodata: "GEEN DATA",
      target: "Doel",
      env_temp: "Omgevingstemperatuur",
      mode: "Modus",
      program: "Programma",
      light_on: "Licht aan",
      light_off: "Licht uit",
      no_program: ["none", "unknown", "unavailable", ""],
      error_title: "FOUT",
      tip_light: "Kelderverlichting",
      locale: "nl-NL",
      decimal_separator: ",",
    },
  };

  static DEFAULTS = {
    zone1_label: "ZONE 1",
    zone2_label: "ZONE 2",
    zone1_min: 5,
    zone1_max: 20,
    zone2_min: 5,
    zone2_max: 20,
    cellar_visual_position: "left",
    hide_cellar_visual: false,
    no_error_states: [
      "00", "0", "none", "no error", "aucune erreur",
      "unknown", "unavailable", ""
    ],
  };

  static STUB_MODE_NAMES = {
    "0": "-",
    "1": "Standard",
    "2": "Eco",
  };

  static VISUAL_ORDER = {
    left: { visual: 0, zone1: 1, zone2: 2 },
    center: { visual: 1, zone1: 0, zone2: 2 },
    right: { visual: 2, zone1: 0, zone2: 1 },
  };

  static getConfigElement() {
    return document.createElement("wine-cellar-card-editor");
  }

  static getStubConfig() {
    return {
      name: "",
      status_entity: "binary_sensor.wine_cellar_status",
      error_entity: "",
      light_entity: "",
      env_temp_entity: "",
      mode_entity: "",
      mode_names: { ...WineCellarCard.STUB_MODE_NAMES },
      program_name_entity: "",
      zone1_label: "ZONE 1",
      zone1_temp_entity: "",
      zone1_target_entity: "",
      zone1_humidity_entity: "",
      zone1_min: 5,
      zone1_max: 20,
      zone2_label: "ZONE 2",
      zone2_temp_entity: "",
      zone2_target_entity: "",
      zone2_humidity_entity: "",
      zone2_min: 5,
      zone2_max: 20,
      cellar_visual_position: "left",
      hide_cellar_visual: false,
    };
  }

  setConfig(config) {
    if (!config.status_entity) {
      throw new Error("wine-cellar-card: status_entity is required");
    }

    this._config = {
      ...WineCellarCard.DEFAULTS,
      ...config,
      mode_names: config.mode_names && typeof config.mode_names === "object"
        ? config.mode_names
        : {},
    };

    this._built = false;

    if (this._hass) {
      this._build();
      this._update();
    }
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._built) this._build();
    this._update();
  }

  getCardSize() {
    return 4;
  }

  get _t() {
    const strings = WineCellarCard.STRINGS;

    const configured = String(this._config?.language || "").toLowerCase();
    if (configured && strings[configured]) return strings[configured];

    const profileLanguage = (
      this._hass?.locale?.language || this._hass?.language || ""
    ).toLowerCase();

    if (profileLanguage) {
      if (strings[profileLanguage]) return strings[profileLanguage];
      const base = profileLanguage.split(/[-_]/)[0];
      if (strings[base]) return strings[base];
    }

    return strings.en;
  }

  _st(entityId) {
    return entityId ? this._hass?.states?.[entityId] : undefined;
  }

  _num(entityId) {
    const state = this._st(entityId);
    if (!state) return null;
    const value = Number.parseFloat(state.state);
    return Number.isFinite(value) ? value : null;
  }

  _fmtNum(value, digits = 1) {
    const number = Number.parseFloat(value);
    if (!Number.isFinite(number)) return null;

    const formatted = digits > 0
      ? String(Number.parseFloat(number.toFixed(digits)))
      : String(Math.round(number));

    return formatted.replace(".", this._t.decimal_separator);
  }

  _moreInfo(entityId) {
    if (!entityId) return;

    this.dispatchEvent(new CustomEvent("hass-more-info", {
      detail: { entityId },
      bubbles: true,
      composed: true,
    }));
  }

  _isLightOn(state) {
    return ["on", "true"].includes(String(state ?? "").toLowerCase());
  }

  _onLightClick() {
    const entityId = this._config.light_entity;
    if (!entityId) return;

    const domain = entityId.split(".")[0];
    if (["light", "switch"].includes(domain)) {
      this._hass.callService(domain, "toggle", { entity_id: entityId });
    } else {
      this._moreInfo(entityId);
    }
  }

  _ringDasharray(fraction) {
    const radius = 39;
    const circumference = 2 * Math.PI * radius;
    const safeFraction = Math.max(0, Math.min(1, fraction));
    return `${(safeFraction * circumference).toFixed(1)} ${circumference.toFixed(1)}`;
  }

  _build() {
    const config = this._config;
    const text = this._t;
    const root = this.shadowRoot || this.attachShadow({ mode: "open" });

    root.innerHTML = `
      <style>
        :host { display: block; }
        ha-card {
          display: block;
          overflow: hidden;
          position: relative;
          padding: 16px 16px 14px;
          color: var(--primary-text-color);
          background: var(--ha-card-background, var(--card-background-color));
          border: 1px solid var(--ha-card-border-color, var(--divider-color));
          border-radius: var(--ha-card-border-radius, 12px);
          box-shadow: var(--ha-card-box-shadow, none);
          font-family: var(--paper-font-body1_-_font-family, inherit);
        }
        .wrap { container-type: inline-size; }
        .header { display: flex; align-items: center; gap: 10px; }
        .h-icon {
          display: flex; align-items: center; justify-content: center;
          width: 44px; height: 44px; flex-shrink: 0;
          border: 1px solid var(--divider-color);
          border-radius: 14px;
          background: var(--ha-card-background, var(--card-background-color));
          box-shadow: 0 2px 6px rgba(0,0,0,.15);
        }
        .h-icon ha-icon { --mdc-icon-size: 24px; color: #7a2038; }
        .h-title {
          flex: 0 1 auto; min-width: 56px;
          overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
          color: var(--primary-text-color);
          font-size: 17.5px; font-weight: 700;
        }
        .badge {
          display: flex; align-items: center; gap: 7px; flex-shrink: 0;
          padding: 6px 11px; border-radius: 999px;
          color: var(--secondary-text-color);
          background: var(--ha-card-background, var(--card-background-color));
          font-size: 11px; font-weight: 700; letter-spacing: .7px;
          white-space: nowrap;
        }
        .badge .b-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--disabled-text-color); }
        .nodata .badge { background: rgba(128,128,128,.12); color: var(--secondary-text-color); }
        .off .badge { background: rgba(var(--rgb-error-color,244,67,54),.14); color: var(--error-color,#f44336); }
        .off .badge .b-dot { background: var(--error-color,#f44336); }
        .on .badge { background: rgba(var(--rgb-success-color,76,175,80),.16); color: var(--success-color,#4caf50); }
        .on .badge .b-dot { background: var(--success-color,#4caf50); }
        .h-spacer { flex: 1; }
        .h-btn {
          display: flex; align-items: center; justify-content: center;
          width: 35px; height: 35px; flex-shrink: 0;
          border: 1px solid var(--divider-color); border-radius: 12px;
          color: var(--secondary-text-color);
          background: var(--ha-card-background, var(--card-background-color));
          cursor: pointer; transition: transform .12s ease;
        }
        .h-btn:active { transform: scale(.94); }
        .h-btn ha-icon { --mdc-icon-size: 19px; }
        .h-btn.on {
          color: var(--primary-color); border-color: var(--primary-color);
          background: rgba(var(--rgb-primary-color,3,169,244),.12);
        }
        .error-banner {
          display: flex; align-items: center; gap: 8px;
          margin-top: 12px; padding: 10px 14px; border-radius: 14px;
          color: var(--error-color,#db4437);
          background: rgba(var(--rgb-error-color,219,68,55),.12);
          font-size: 13px; font-weight: 700; cursor: pointer;
        }
        .error-banner ha-icon { --mdc-icon-size: 18px; }
        .content-row { display: flex; gap: 12px; margin-top: 14px; align-items: center; }
        .cellar-visual {
          display: flex; align-items: center; width: 83px; flex-shrink: 0;
          transition: opacity .4s ease, filter .4s ease;
        }
        .cellar-visual svg { width: 100%; height: auto; display: block; filter: drop-shadow(0 4px 8px rgba(0,0,0,.25)); }
        .off .cellar-visual { opacity: .45; filter: grayscale(.4); }
        .cv-glow { transition: opacity .5s ease; }
        .zone-panel {
          flex: 1 1 0; min-width: 0; padding: 10px 8px;
          text-align: center; border: 1px solid var(--divider-color);
          border-radius: 12px;
          background: var(--ha-card-background, var(--card-background-color));
        }
        .zone-label {
          margin-bottom: 6px; color: var(--secondary-text-color);
          font-size: 9.5px; font-weight: 800; letter-spacing: 1.1px;
        }
        .ring-box { position: relative; width: 68px; height: 68px; margin: 0 auto; cursor: pointer; }
        .ring-box svg { width: 100%; height: 100%; }
        .ring-track { stroke: var(--divider-color); }
        .ring-arc { stroke: #b0335a; stroke-linecap: round; transition: stroke-dasharray .5s ease; }
        .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
        .ring-temp { color: var(--primary-text-color); font-size: 14.5px; font-weight: 800; line-height: 1; }
        .ring-unit { color: var(--secondary-text-color); font-size: 8.5px; font-weight: 700; }
        .zone-target { margin-top: 6px; color: var(--secondary-text-color); font-size: 9.5px; cursor: pointer; }
        .zone-target b { color: var(--primary-text-color); }
        .zone-humidity {
          display: flex; align-items: center; justify-content: center; gap: 3px;
          margin-top: 4px; color: var(--info-color,#039be5);
          font-size: 10px; font-weight: 700; cursor: pointer;
        }
        .zone-humidity ha-icon { --mdc-icon-size: 12px; }
        .panel {
          display: grid; grid-template-columns: repeat(3,1fr);
          margin-top: 12px; padding: 12px 16px;
          border: 1px solid var(--divider-color); border-radius: 12px;
          background: var(--ha-card-background, var(--card-background-color));
        }
        .info-item { min-width: 0; padding: 0 10px; border-left: 1px solid var(--divider-color); cursor: pointer; }
        .info-item:first-child { border-left: 0; padding-left: 0; }
        .info-label { color: var(--secondary-text-color); font-size: 10px; font-weight: 700; letter-spacing: .8px; }
        .info-value { margin-top: 4px; color: var(--primary-text-color); font-size: 13.5px; font-weight: 800; overflow-wrap: break-word; }
        .content-row:has(> .cellar-visual.hidden) .ring-box { width: 84px; height: 84px; }
        .content-row:has(> .cellar-visual.hidden) .ring-temp { font-size: 17px; }
        .hidden { display: none !important; }
        @container (max-width: 320px) {
          .content-row { flex-direction: column; }
          .cellar-visual { width: 88px; }
          .zone-panel { box-sizing: border-box; width: 100%; }
          .panel { grid-template-columns: 1fr 1fr; row-gap: 10px; }
        }
      </style>

      <ha-card>
        <div class="wrap off" id="wrap">
          <div class="header">
            <div class="h-icon"><ha-icon icon="mdi:glass-wine"></ha-icon></div>
            <div class="h-title" id="name"></div>
            <div class="badge"><span class="b-dot"></span><span id="badgeText"></span></div>
            <div class="h-spacer"></div>
            <div class="h-btn hidden" id="lightBtn" title="${text.tip_light}">
              <ha-icon icon="mdi:lightbulb-off-outline" id="lightIcon"></ha-icon>
            </div>
          </div>

          <div class="error-banner hidden" id="errorBanner">
            <ha-icon icon="mdi:alert-circle"></ha-icon><span id="errorText"></span>
          </div>

          <div class="content-row">
            <div class="cellar-visual" id="cellarVisual">
              <svg viewBox="0 0 96 180" xmlns="http://www.w3.org/2000/svg" aria-label="Wine cellar illustration">
                <defs>
                  <linearGradient id="cvBody" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0" stop-color="#2b2b2e"/><stop offset=".5" stop-color="#161618"/><stop offset="1" stop-color="#08080a"/>
                  </linearGradient>
                  <linearGradient id="cvGlass" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stop-color="#20262f"/><stop offset="1" stop-color="#0b0e13"/>
                  </linearGradient>
                </defs>
                <rect x="4" y="4" width="88" height="172" rx="10" fill="url(#cvBody)" stroke="#000"/>
                <rect x="4" y="4" width="88" height="15" rx="10" fill="#0b0b0d"/>
                <rect x="4" y="11" width="88" height="8" fill="#0b0b0d"/>
                <rect x="39" y="8" width="18" height="6.4" rx="2" fill="#000" stroke="#2a2a2a" stroke-width=".5"/>
                <text x="48" y="12.9" text-anchor="middle" font-size="4.4" font-family="monospace" fill="#6fd0e0">12°</text>
                <rect x="10" y="23" width="76" height="145" rx="6" fill="url(#cvGlass)" stroke="#000"/>
                <rect class="cv-glow" id="cvGlow" x="10" y="23" width="76" height="145" rx="6" fill="#ffcf7a" opacity=".08"/>
                <g>
                  <circle cx="18" cy="40" r="4" fill="#7a1f2b"/>
                  <circle cx="30" cy="40" r="4" fill="#e9e3d3"/>
                  <circle cx="42" cy="40" r="4" fill="#33264a"/>
                  <circle cx="54" cy="40" r="4" fill="#b8862c"/>
                  <circle cx="66" cy="40" r="4" fill="#8a2035"/>
                  <circle cx="78" cy="40" r="4" fill="#4a1e2e"/>
                  <circle cx="18" cy="58" r="4" fill="#4a1e2e"/>
                  <circle cx="30" cy="58" r="4" fill="#8a2035"/>
                  <circle cx="42" cy="58" r="4" fill="#b8862c"/>
                  <circle cx="54" cy="58" r="4" fill="#33264a"/>
                  <circle cx="66" cy="58" r="4" fill="#e9e3d3"/>
                  <circle cx="78" cy="58" r="4" fill="#7a1f2b"/>
                  <circle cx="20" cy="100" r="5" fill="#8a2035"/>
                  <circle cx="35" cy="100" r="5" fill="#33264a"/>
                  <circle cx="50" cy="100" r="5" fill="#e9e3d3"/>
                  <circle cx="65" cy="100" r="5" fill="#b8862c"/>
                  <circle cx="78" cy="100" r="5" fill="#7a1f2b"/>
                  <circle cx="20" cy="122" r="5" fill="#33264a"/>
                  <circle cx="35" cy="122" r="5" fill="#7a1f2b"/>
                  <circle cx="50" cy="122" r="5" fill="#b8862c"/>
                  <circle cx="65" cy="122" r="5" fill="#e9e3d3"/>
                  <circle cx="78" cy="122" r="5" fill="#4a1e2e"/>
                </g>
                <rect x="10" y="76" width="76" height="5" fill="#050506"/>
                <text x="48" y="80" text-anchor="middle" font-size="3" font-family="sans-serif" letter-spacing="1.5" fill="#5a5a5e">DUAL SPACE</text>
                <rect x="14" y="140" width="34" height="7" rx="3.5" fill="#141416"/>
                <circle cx="17" cy="143.5" r="1.6" fill="#c9a227"/>
                <rect x="34" y="152" width="40" height="7.5" rx="3.75" fill="#1c1c1f"/>
                <circle cx="38" cy="155.75" r="1.7" fill="#c9a227"/>
                <rect x="15" y="174" width="9" height="4" rx="1.5" fill="#1a1a1c"/>
                <rect x="72" y="174" width="9" height="4" rx="1.5" fill="#1a1a1c"/>
              </svg>
            </div>
            ${this._zoneMarkup(1)}
            ${this._zoneMarkup(2)}
          </div>

          <div class="panel hidden" id="infoPanel">
            <div class="info-item hidden" id="envItem"><div class="info-label">${text.env_temp}</div><div class="info-value" id="envValue">—</div></div>
            <div class="info-item hidden" id="modeItem"><div class="info-label">${text.mode}</div><div class="info-value" id="modeValue">—</div></div>
            <div class="info-item hidden" id="programItem"><div class="info-label">${text.program}</div><div class="info-value" id="programValue">—</div></div>
          </div>
        </div>
      </ha-card>
    `;

    this._el = (id) => root.getElementById(id);
    const moreInfo = (entityId) => () => this._moreInfo(entityId);

    this._el("errorBanner").addEventListener("click", moreInfo(config.error_entity));
    this._el("lightBtn").addEventListener("click", () => this._onLightClick());
    this._el("envItem").addEventListener("click", moreInfo(config.env_temp_entity));
    this._el("modeItem").addEventListener("click", moreInfo(config.mode_entity));
    this._el("programItem").addEventListener("click", moreInfo(config.program_name_entity));

    for (const zone of [1, 2]) {
      this._el(`zone${zone}Ring`).addEventListener("click", moreInfo(config[`zone${zone}_temp_entity`]));
      this._el(`zone${zone}Target`).addEventListener("click", moreInfo(config[`zone${zone}_target_entity`]));
      this._el(`zone${zone}HumidityRow`).addEventListener("click", moreInfo(config[`zone${zone}_humidity_entity`]));
      this._el(`zone${zone}Label`).textContent = config[`zone${zone}_label`];
    }

    const order = WineCellarCard.VISUAL_ORDER[config.cellar_visual_position] || WineCellarCard.VISUAL_ORDER.left;
    this._el("cellarVisual").style.order = order.visual;
    this._el("zone1Panel").style.order = order.zone1;
    this._el("zone2Panel").style.order = order.zone2;
    this._el("cellarVisual").classList.toggle("hidden", Boolean(config.hide_cellar_visual));

    this._built = true;
  }

  _zoneMarkup(zone) {
    return `
      <div class="zone-panel hidden" id="zone${zone}Panel">
        <div class="zone-label" id="zone${zone}Label"></div>
        <div class="ring-box" id="zone${zone}Ring">
          <svg viewBox="0 0 92 92">
            <circle class="ring-track" cx="46" cy="46" r="39" fill="none" stroke-width="7"/>
            <circle class="ring-arc" id="zone${zone}Arc" cx="46" cy="46" r="39" fill="none" stroke-width="7" stroke-dasharray="0 245" transform="rotate(-90 46 46)"/>
          </svg>
          <div class="ring-center"><div class="ring-temp" id="zone${zone}Temp">—</div><div class="ring-unit">°C</div></div>
        </div>
        <div class="zone-target" id="zone${zone}Target"></div>
        <div class="zone-humidity hidden" id="zone${zone}HumidityRow"><ha-icon icon="mdi:water-percent"></ha-icon><span id="zone${zone}Humidity"></span></div>
      </div>
    `;
  }

  _update() {
    const config = this._config;
    const text = this._t;
    const wrap = this._el("wrap");
    const status = this._st(config.status_entity);
    const noData = !status || ["unknown", "unavailable"].includes(status.state);
    const isOn = !noData && String(status.state).toLowerCase() === "on";

    wrap.classList.toggle("on", isOn);
    wrap.classList.toggle("off", !isOn && !noData);
    wrap.classList.toggle("nodata", noData);
    this._el("name").textContent = config.name || text.name;
    this._el("badgeText").textContent = noData ? text.badge_nodata : (isOn ? text.badge_on : text.badge_off);

    if (config.error_entity) {
      const errorState = this._st(config.error_entity);
      const value = String(errorState?.state ?? "").toLowerCase();
      const hasError = Boolean(errorState) && !config.no_error_states.includes(value);
      this._el("errorBanner").classList.toggle("hidden", !hasError);
      if (hasError) this._el("errorText").textContent = `${text.error_title}: ${errorState.state}`;
    } else {
      this._el("errorBanner").classList.add("hidden");
    }

    let lightOn = false;
    if (config.light_entity) {
      lightOn = this._isLightOn(this._st(config.light_entity)?.state);
      this._el("lightBtn").classList.remove("hidden");
      this._el("lightBtn").classList.toggle("on", isOn && lightOn);
      this._el("lightBtn").title = isOn && lightOn ? text.light_on : text.light_off;
      this._el("lightIcon").setAttribute("icon", isOn && lightOn ? "mdi:lightbulb-on" : "mdi:lightbulb-off-outline");
    } else {
      this._el("lightBtn").classList.add("hidden");
    }

    this._el("cvGlow").setAttribute("opacity", isOn && lightOn ? ".55" : (isOn ? ".15" : "0"));

    this._updateZone(1, isOn);
    this._updateZone(2, isOn);

    let anyInfo = false;
    if (config.env_temp_entity) {
      const value = this._num(config.env_temp_entity);
      this._el("envItem").classList.remove("hidden");
      this._el("envValue").textContent = isOn && value !== null ? `${this._fmtNum(value, 1)} °C` : "N/A";
      anyInfo = true;
    } else this._el("envItem").classList.add("hidden");

    if (config.mode_entity) {
      const state = this._st(config.mode_entity);
      const raw = state?.state;
      const modeNames = config.mode_names || {};
      const hasCustomNames = Object.keys(modeNames).length > 0;
      const label = hasCustomNames && raw !== undefined && raw !== null && Object.prototype.hasOwnProperty.call(modeNames, raw)
        ? modeNames[raw]
        : raw;
      this._el("modeItem").classList.remove("hidden");
      this._el("modeValue").textContent = isOn && raw !== undefined && raw !== null ? label : "N/A";
      anyInfo = true;
    } else this._el("modeItem").classList.add("hidden");

    if (config.program_name_entity) {
      const state = this._st(config.program_name_entity);
      const raw = String(state?.state ?? "").toLowerCase();
      this._el("programItem").classList.remove("hidden");
      this._el("programValue").textContent = isOn && !text.no_program.includes(raw) ? state.state : "N/A";
      anyInfo = true;
    } else this._el("programItem").classList.add("hidden");

    this._el("infoPanel").classList.toggle("hidden", !anyInfo);
  }

  _updateZone(zone, isOn) {
    const config = this._config;
    const tempEntity = config[`zone${zone}_temp_entity`];
    const targetEntity = config[`zone${zone}_target_entity`];
    const humidityEntity = config[`zone${zone}_humidity_entity`];
    const panel = this._el(`zone${zone}Panel`);

    if (!tempEntity && !targetEntity && !humidityEntity) {
      panel.classList.add("hidden");
      return;
    }

    panel.classList.remove("hidden");
    const temp = tempEntity ? this._num(tempEntity) : null;
    const target = targetEntity ? this._num(targetEntity) : null;
    const humidity = humidityEntity ? this._num(humidityEntity) : null;
    const min = Number(config[`zone${zone}_min`]);
    const max = Number(config[`zone${zone}_max`]);

    this._el(`zone${zone}Temp`).textContent = isOn && temp !== null ? this._fmtNum(temp, 1) : "N/A";
    const fraction = isOn && temp !== null && max !== min ? (temp - min) / (max - min) : 0;
    this._el(`zone${zone}Arc`).setAttribute("stroke-dasharray", this._ringDasharray(fraction));

    this._el(`zone${zone}Target`).innerHTML = targetEntity
      ? (isOn && target !== null ? `${this._t.target}: <b>${this._fmtNum(target, 1)} °C</b>` : `${this._t.target}: <b>N/A</b>`)
      : "";

    if (humidityEntity) {
      this._el(`zone${zone}HumidityRow`).classList.remove("hidden");
      this._el(`zone${zone}Humidity`).textContent = isOn && humidity !== null ? `${Math.round(humidity)}%` : "N/A";
    } else {
      this._el(`zone${zone}HumidityRow`).classList.add("hidden");
    }
  }
}

class WineCellarCardEditor extends HTMLElement {
  constructor() {
    super();
    this._rendered = false;
    this._modeNamesTimer = null;
  }

  setConfig(config) {
    this._config = { ...config };
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this._updateValues();
  }

  set hass(hass) {
    this._hass = hass;
    if (!this._rendered) {
      this._render();
      this._rendered = true;
    }
    this._updateValues();
  }

  disconnectedCallback() {
    if (this._modeNamesTimer) clearTimeout(this._modeNamesTimer);
  }

  _render() {
    this.innerHTML = `
      <style>
        .editor { display: grid; gap: 12px; padding: 8px 0; }
        details.section {
          overflow: hidden;
          background: var(--ha-card-background, var(--card-background-color));
          border: 1px solid var(--divider-color);
          border-radius: var(--ha-card-border-radius,12px);
        }
        summary {
          display: flex; align-items: center; justify-content: space-between; gap: 12px;
          padding: 16px; color: var(--primary-text-color);
          font-size: 16px; font-weight: 600; cursor: pointer;
          list-style: none; user-select: none;
        }
        summary::-webkit-details-marker { display: none; }
        summary::after {
          content: ""; width: 8px; height: 8px; flex-shrink: 0;
          border-right: 2px solid var(--secondary-text-color);
          border-bottom: 2px solid var(--secondary-text-color);
          transform: rotate(45deg); transition: transform .2s ease;
        }
        details[open] summary::after { transform: rotate(225deg); }
        details[open] summary { border-bottom: 1px solid var(--divider-color); }
        .section-content { display: grid; gap: 14px; padding: 16px; }
        .grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
        .entity-grid { display: grid; grid-template-columns: 1fr; gap: 14px; }
        label, .field { display: grid; gap: 6px; color: var(--secondary-text-color); font-size: 12px; }
        input, select, textarea {
          box-sizing: border-box; width: 100%; min-height: 42px; padding: 8px 10px;
          color: var(--primary-text-color);
          background: var(--ha-card-background, var(--card-background-color));
          border: 1px solid var(--divider-color); border-radius: 8px; font: inherit;
        }
        textarea {
          min-height: 112px; resize: vertical; line-height: 1.5;
          font-family: var(--code-font-family, ui-monospace, SFMono-Regular, Consolas, monospace);
        }
        ha-entity-picker { display: block; width: 100%; }
        .switch-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; min-height: 42px; }
        .switch-text { display: grid; gap: 3px; min-width: 0; }
        .switch-label { color: var(--primary-text-color); font-size: 14px; }
        .field-description { color: var(--secondary-text-color); font-size: 12px; line-height: 1.4; }
        ha-switch { flex-shrink: 0; }
        @media (max-width:600px) { .grid { grid-template-columns: 1fr; } }
      </style>

      <div class="editor">
        <details class="section" open>
          <summary>General</summary>
          <div class="section-content"><div class="entity-grid">
            <label>Card name<input data-config="name" type="text"></label>
            ${this._entityPicker("status_entity", "Status entity", ["binary_sensor"])}
            <label>
              Language
              <select data-config="language">
                <option value="">Automatic (Home Assistant language)</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="it">Italiano</option>
                <option value="pt">Português</option>
                <option value="de">Deutsch</option>
                <option value="nl">Nederlands</option>
              </select>
            </label>
            <label>Cellar illustration position<select data-config="cellar_visual_position"><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></select></label>
            <div class="switch-row">
              <div class="switch-text"><span class="switch-label">Hide cellar illustration</span><span class="field-description">Hide the cellar illustration and enlarge the temperature zones.</span></div>
              <ha-switch data-config="hide_cellar_visual"></ha-switch>
            </div>
          </div></div>
        </details>

        ${this._zoneSection(1)}
        ${this._zoneSection(2)}

        <details class="section">
          <summary>Additional entities</summary>
          <div class="section-content"><div class="entity-grid">
            ${this._entityPicker("error_entity", "Error entity", ["sensor"])}
            ${this._entityPicker("light_entity", "Light entity", ["binary_sensor","light","switch"])}
            ${this._entityPicker("env_temp_entity", "Environment temperature", ["sensor"])}
            ${this._entityPicker("mode_entity", "Mode entity", ["sensor","select","input_select"])}
            <label>
              Mode names
              <textarea data-config="mode_names" spellcheck="false" placeholder="'0': '-'
'1': Standard
'2': Eco"></textarea>
              <span class="field-description">One mapping per line, format: code: label. Clear the field to show the mode entity's raw, untranslated value on the card instead.</span>
            </label>
            ${this._entityPicker("program_name_entity", "Program name entity", ["sensor"])}
          </div></div>
        </details>
      </div>
    `;

    this._initializeEntityPickers();
    this._initializeStandardFields();
  }

  _entityPicker(key, label, domains = []) {
    return `<div class="field"><span>${label}</span><ha-entity-picker data-config="${key}" data-domains="${domains.join(',')}" allow-custom-entity></ha-entity-picker></div>`;
  }

  _zoneSection(zone) {
    return `
      <details class="section">
        <summary>Zone ${zone}</summary>
        <div class="section-content">
          <div class="entity-grid">
            <label>Label<input data-config="zone${zone}_label" type="text"></label>
            ${this._entityPicker(`zone${zone}_temp_entity`, "Temperature entity", ["sensor"])}
            ${this._entityPicker(`zone${zone}_target_entity`, "Target temperature entity", ["sensor","number"])}
            ${this._entityPicker(`zone${zone}_humidity_entity`, "Humidity entity", ["sensor"])}
          </div>
          <div class="grid">
            <label>Minimum temperature<input data-config="zone${zone}_min" type="number" step="0.5"></label>
            <label>Maximum temperature<input data-config="zone${zone}_max" type="number" step="0.5"></label>
          </div>
        </div>
      </details>
    `;
  }

  _initializeEntityPickers() {
    this.querySelectorAll("ha-entity-picker[data-config]").forEach((picker) => {
      picker.hass = this._hass;
      picker.allowCustomEntity = true;
      const domains = picker.dataset.domains?.split(",").filter(Boolean);
      if (domains?.length) picker.includeDomains = domains;
      picker.addEventListener("value-changed", (event) => this._valueChanged(event));
    });
  }

  _initializeStandardFields() {
    this.querySelectorAll("input[data-config], textarea[data-config]").forEach((element) => {
      element.addEventListener("input", (event) => this._valueChanged(event));
    });
    this.querySelectorAll("select[data-config], ha-switch[data-config]").forEach((element) => {
      element.addEventListener("change", (event) => this._valueChanged(event));
    });
  }

  _updateValues() {
    if (!this._rendered || !this._config) return;

    this.querySelectorAll("[data-config]").forEach((element) => {
      const key = element.dataset.config;
      const value = this._config[key];

      if (element.tagName === "HA-ENTITY-PICKER") {
        element.hass = this._hass;
        element.value = value ?? "";
        return;
      }
      if (element.tagName === "HA-SWITCH") {
        element.checked = value === true;
        return;
      }
      if (element.tagName === "TEXTAREA" && key === "mode_names") {
        if (document.activeElement !== element) {
          element.value = this._formatModeNames(value);
        }
        return;
      }

      if (document.activeElement !== element) element.value = value ?? "";
    });
  }

  _formatModeNames(modeNames) {
    if (!modeNames || typeof modeNames !== "object" || Array.isArray(modeNames)) return "";
    return Object.entries(modeNames).map(([key, label]) => `'${key}': ${label}`).join("\n");
  }

  _parseModeNames(text) {
    const result = {};
    String(text ?? "").split(/\r?\n/).forEach((line) => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) return;
      const separator = trimmed.indexOf(":");
      if (separator < 0) return;
      const key = trimmed.slice(0, separator).trim().replace(/^['"]|['"]$/g, "");
      const label = trimmed.slice(separator + 1).trim().replace(/^['"]|['"]$/g, "");
      if (key) result[key] = label;
    });
    return result;
  }

  _valueChanged(event) {
    if (!this._config) return;
    const target = event.currentTarget;
    const key = target?.dataset?.config;
    if (!key) return;

    let value;
    if (target.tagName === "HA-ENTITY-PICKER") {
      value = event.detail?.value ?? target.value ?? "";
    } else if (target.tagName === "HA-SWITCH") {
      value = Boolean(target.checked);
    } else if (target.tagName === "TEXTAREA" && key === "mode_names") {
      value = this._parseModeNames(target.value);
    } else if (target.type === "number") {
      value = target.value === "" ? undefined : Number(target.value);
    } else {
      value = target.value;
    }

    const config = { ...this._config, [key]: value };

    if (value === "" || value === undefined) delete config[key];
    this._config = config;

    const emit = () => this.dispatchEvent(new CustomEvent("config-changed", {
      detail: { config: { ...this._config } },
      bubbles: true,
      composed: true,
    }));

    if (key === "mode_names") {
      if (this._modeNamesTimer) clearTimeout(this._modeNamesTimer);
      this._modeNamesTimer = setTimeout(emit, 250);
    } else {
      emit();
    }
  }
}

if (!customElements.get("wine-cellar-card-editor")) {
  customElements.define("wine-cellar-card-editor", WineCellarCardEditor);
}
if (!customElements.get("wine-cellar-card")) {
  customElements.define("wine-cellar-card", WineCellarCard);
}

window.customCards = window.customCards || [];
if (!window.customCards.some((card) => card.type === "wine-cellar-card")) {
  window.customCards.push({
    type: "wine-cellar-card",
    name: "Wine Cellar Card",
    description: "Dual-zone wine cellar card with temperature, humidity, light, mode and errors",
    preview: true,
  });
}
