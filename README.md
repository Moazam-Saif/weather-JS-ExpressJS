# Weather App

A browser-based weather app that shows current conditions for your location or any searched city. Pulls weather from OpenWeatherMap; city autocomplete is served by a small local Express server.

## Essential Files

| File | Role |
|---|---|
| `weather.html` | UI structure — search input, weather display card, bottom stats bar |
| `weather.js` | All client logic — geolocation, API fetch, DOM updates, debounced search, dropdown |
| `weather.css` | Card layout, dropdown styling, search input appearance |
| `citiesApi.js` | Express server — reads `countries.json`, serves flat `"City, Country"` list at `GET /cities` |
| `package.json` | Declares ES module type and Express dependency |

> `node_modules/` is a generated dependency tree — excluded by `.gitignore` and fully reproducible with `npm install`.

---

## How It Works

```
Page load
  └── getLocation()       → browser Geolocation API → [lat, lon]
        └── fetchAPI()    → OpenWeatherMap /data/2.5/weather?lat=&lon=
              └── updates DOM: city, condition, temp, feels like,
                              humidity, wind, pressure, weather icon

Search input (debounced 300ms)
  └── updateDropdown()    → filters countryCityList against typed query
        └── on city select:
              └── getLatLon()   → OpenWeatherMap /geo/1.0/direct?q=
                    └── fetchAPI() with new lat/lon

City list (loaded once on startup)
  └── getData()           → GET http://localhost:8080/cities
        └── countryCityList[] populated for dropdown filtering

citiesApi.js (separate Node process)
  └── reads countries.json → flattens to ["City, Country", ...]
        └── serves at GET /localhost:8080/cities
```

Temperatures are converted from Kelvin to Celsius (`K - 273.15`). Weather condition background color is looked up from a hardcoded `colors` map.

---

## Prerequisites

- Node.js
- An [OpenWeatherMap API key](https://openweathermap.org/api)
- A `countries.json` file: `{ "CountryName": ["City1", "City2", ...], ... }`

---

## Setup

**1. Install dependencies:**
```bash
npm install
```

**2. Set your API key** in `weather.js`:
```js
const key = "YOUR_API_KEY_HERE";
```

**3. Fix the `countries.json` path** in `citiesApi.js` (currently hardcoded to a local Windows path):
```js
const data = JSON.parse(readFileSync('./countries.json', 'utf8'));
```

**4. Start the cities server:**
```bash
node citiesApi.js
# → http://localhost:8080
```

**5. Open `weather.html`** via a local server or browser (geolocation requires `localhost` or HTTPS).

---

## Known Limitations / TODOs

- API key is hardcoded in `weather.js` — should be an environment variable or server-side proxy
- `countries.json` path in `citiesApi.js` is an absolute local Windows path — breaks on any other machine as-is
- Min/max temperatures both display `main.temp`; `main.temp_min` and `main.temp_max` from the API response are unused
- `getData()` in `weather.js` tries to iterate the response as `{ country: [cities] }` but `citiesApi.js` already returns a flat array — the loop does nothing and `countryCityList` stays empty (search never returns results)
- No UI feedback when geolocation is denied or an API call fails
- `colors` map only covers `Clear`, `Sunny`, and `Clouds`; all other conditions render with no background color
