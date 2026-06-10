# Weather App

A browser-based weather app that shows current conditions for your location or any searched city. Uses the OpenWeatherMap API for weather data and a local Express server for city/country autocomplete.

---

## Features

- Auto-detects your location via the browser Geolocation API on load
- Displays city, current temperature (°C), weather condition, feels like, humidity, wind speed, and pressure
- City search with debounced autocomplete dropdown (300ms delay)
- Autocomplete data served from a local Express API backed by a `countries.json` file

---

## Prerequisites

- Node.js
- An [OpenWeatherMap](https://openweathermap.org/api) API key
- A `countries.json` file mapping country names to arrays of city names

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

**3. Update the path to `countries.json`** in `citiesApi.js`:
```js
const data = JSON.parse(readFileSync('/path/to/countries.json', 'utf8'));
```

**4. Start the cities API server:**
```bash
node citiesApi.js
# Runs at http://localhost:8080
```

**5. Open `weather.html`** in a browser (serve it via a local server if needed, since geolocation requires a secure or localhost context).

---

## Project Structure

```
weather.html      # UI
weather.css       # Styles
weather.js        # Weather fetching, search, geolocation
citiesApi.js      # Express server — serves city/country list
package.json      # Node dependencies (Express, ES modules)
```

---

## Known Limitations / TODOs

- API key is hardcoded in `weather.js` — should be moved to an environment variable
- Path to `countries.json` in `citiesApi.js` is an absolute local path — must be updated per machine
- Min/max temperatures both show the current temp (the API `main.temp_min`/`temp_max` fields are unused)
- No error state shown in the UI if the API call fails or geolocation is denied
- Weather condition color map only covers `Clear`, `Sunny`, and `Clouds`; other conditions fall back to no color
