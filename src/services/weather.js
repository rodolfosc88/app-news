import axios from 'axios';

const WEATHER_URL = import.meta.env.VITE_API_URL;
const WEATHER_KEY = import.meta.env.VITE_API_ID;
const MAPBOX_URL = import.meta.env.VITE_API_URL_MAPBOX;
const MAPBOX_KEY = import.meta.env.VITE_API_MAPBOX_KEY;

const STORAGE_KEY = 'savedCities';

// Coordenadas vindas da URL não são confiáveis: valida antes de usar.
export const parseCoords = (lat, lng) => {
  const la = Number(lat);
  const ln = Number(lng);
  if (!Number.isFinite(la) || !Number.isFinite(ln)) return null;
  if (la < -90 || la > 90 || ln < -180 || ln > 180) return null;
  return { lat: la, lng: ln };
};

export const iconUrl = (icon) =>
  `https://openweathermap.org/img/wn/${encodeURIComponent(icon)}@2x.png`;

export const searchPlaces = async (query) => {
  const { data } = await axios.get(`${MAPBOX_URL}/forward`, {
    params: { q: query, access_token: MAPBOX_KEY, types: 'place', language: 'pt' },
  });
  return data.features ?? [];
};

export const getCurrentWeather = async ({ lat, lng }) => {
  const { data } = await axios.get(`${WEATHER_URL}/2.5/weather`, {
    params: { lat, lon: lng, appid: WEATHER_KEY, units: 'metric', lang: 'pt_br' },
  });
  return data;
};

export const getForecast = async ({ lat, lng }) => {
  const { data } = await axios.get(`${WEATHER_URL}/3.0/onecall`, {
    params: { lat, lon: lng, appid: WEATHER_KEY, units: 'metric', lang: 'pt_br' },
  });
  return data;
};

// localStorage pode estar vazio, corrompido ou indisponível.
export const loadCities = () => {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((c) => c && c.id && parseCoords(c.coords?.lat, c.coords?.lng));
  } catch {
    return [];
  }
};

export const saveCities = (cities) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cities));
  } catch {
    // armazenamento indisponível (modo privado, cota cheia): ignora
  }
};
