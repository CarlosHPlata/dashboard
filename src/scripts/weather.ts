import moment from 'moment-timezone';

// Timezone configuration (Madrid)
const TIMEZONE = 'Europe/Madrid';

// API configuration
const WEATHER_API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';
const LATITUDE = 38.577422;
const LONGITUDE = -0.1354468;
const DAILY_PARAMS = [
  'weather_code',
  'temperature_2m_max',
  'temperature_2m_min',
  'precipitation_probability_max',
  'rain_sum',
  'showers_sum',
  'snowfall_sum',
  'cloud_cover_mean'
];
const CURRENT_PARAMS = [
  'temperature_2m',
  'relative_humidity_2m',
  'apparent_temperature',
  'is_day',
  'precipitation',
  'rain',
  'showers',
  'snowfall',
  'cloud_cover'
];
const API_TIMEZONE = 'auto';

// Build the complete API URL
const WEATHER_API_URL = `${WEATHER_API_BASE_URL}?latitude=${LATITUDE}&longitude=${LONGITUDE}&daily=${DAILY_PARAMS.join(',')}&current=${CURRENT_PARAMS.join(',')}&timezone=${API_TIMEZONE}`;

// Cache configuration
const CACHE_KEY = 'weather_data_cache';
const CACHE_DURATION_MS = 1 * 60 * 60 * 1000; // 1 hours in milliseconds
const SYNC_INTERVAL_MS = 1 * 60 * 60 * 1000; // 1 hours

// Weather category enum
enum WeatherCategory {
  CLEAR = 'clear',
  MID_CLOUDY = 'mid-cloudy',
  CLOUDY = 'cloudy',
  MID_RAINY = 'mid-rainy',
  RAINY = 'rainy',
  MID_SNOWY = 'mid-snowy',
  SNOWY = 'snowy',
  THUNDERSTORM = 'thunderstorms'
}

// TypeScript Interfaces
interface WeatherApiResponse {
  daily: {
    time: string[];
    weather_code: number[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
  };
  current: {
    temperature_2m: number;
    relative_humidity_2m: number;
    apparent_temperature: number;
    is_day: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    cloud_cover: number;
  };
}

interface DailyWeather {
  date: string;
  dayString: string;
  dateString: string;
  weatherCategory: WeatherCategory;
  maxTemp: number;
  minTemp: number;
}

interface CurrentWeather {
  temperature: number;
  humidity: number;
  apparentTemp: number;
  isDay: boolean;
  precipitation: number;
  cloudCover: number;
}

interface ProcessedWeatherData {
  daily: DailyWeather[];
  current: CurrentWeather;
}

interface WeatherCache {
  timestamp: number;
  data: ProcessedWeatherData;
}

class Weather {
  private weatherContainer: HTMLElement | null;
  private loaderElement: HTMLElement | null;
  private contentElement: HTMLElement | null;
  private syncInterval: number = SYNC_INTERVAL_MS;

  constructor() {
    this.weatherContainer = document.getElementById('weather-container');
    this.loaderElement = document.getElementById('weather-loader');
    this.contentElement = document.getElementById('weather-content');

    if (this.weatherContainer) {
      this.init();
    } else {
      console.error('Weather container element not found');
    }
  }

  private async init() {
    // Check for cached data
    const cachedData = this.getCachedData();

    if (cachedData) {
      console.log('Using cached weather data');
      this.updateDisplay(cachedData);
      this.hideLoader();
    } else {
      console.log('Fetching fresh weather data');
      await this.fetchAndCacheWeatherData();
    }

    // Set up refresh interval (every 1 hours)
    setInterval(() => this.fetchAndCacheWeatherData(), this.syncInterval);
  }

  private getCachedData(): ProcessedWeatherData | null {
    try {
      const cached = localStorage.getItem(CACHE_KEY);
      if (!cached) return null;

      const cacheData: WeatherCache = JSON.parse(cached);
      const now = Date.now();

      // Check if cache is still valid (within 1 hours)
      if (now - cacheData.timestamp < CACHE_DURATION_MS) {
        return cacheData.data;
      }

      // Cache expired, remove it
      localStorage.removeItem(CACHE_KEY);
      return null;
    } catch (error) {
      console.error('Error reading cache:', error);
      return null;
    }
  }

  private setCachedData(data: ProcessedWeatherData): void {
    try {
      const cacheData: WeatherCache = {
        timestamp: Date.now(),
        data: data
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
      console.log('Weather data cached successfully');
    } catch (error) {
      console.error('Error caching data:', error);
    }
  }

  private async fetchAndCacheWeatherData(): Promise<void> {
    try {
      const response = await fetch(WEATHER_API_URL);
      if (!response.ok) throw new Error('Failed to fetch weather data');

      const data: WeatherApiResponse = await response.json();
      const processedData = this.processWeatherData(data);

      // Cache the processed data
      this.setCachedData(processedData);

      // Update display
      this.updateDisplay(processedData);
      this.hideLoader();
    } catch (error) {
      console.error('Error fetching weather data:', error);
      // Don't hide loader on error - keep showing loading state
    }
  }

  private processWeatherData(response: WeatherApiResponse): ProcessedWeatherData {
    const dailyWeather: DailyWeather[] = [];

    // Process daily forecast data (get first 7 days)
    const daysToShow = Math.min(7, response.daily.time.length);
    for (let i = 0; i < daysToShow; i++) {
      const date = moment.tz(response.daily.time[i], TIMEZONE);

      dailyWeather.push({
        date: response.daily.time[i],
        dayString: date.format('dddd'),
        dateString: date.format('MMM D'),
        weatherCategory: Weather.wmoCodeToCategory(response.daily.weather_code[i]),
        maxTemp: Math.round(response.daily.temperature_2m_max[i]),
        minTemp: Math.round(response.daily.temperature_2m_min[i])
      });
    }

    // Process current weather data
    const currentWeather: CurrentWeather = {
      temperature: Math.round(response.current.temperature_2m),
      humidity: Math.round(response.current.relative_humidity_2m),
      apparentTemp: Math.round(response.current.apparent_temperature),
      isDay: response.current.is_day === 1,
      precipitation: response.current.precipitation,
      cloudCover: Math.round(response.current.cloud_cover)
    };

    return {
      daily: dailyWeather,
      current: currentWeather
    };
  }

  private updateDisplay(data: ProcessedWeatherData): void {
    if (!this.weatherContainer) return;

    // Update current weather display
    const currentTempElement = document.getElementById('current-weather-temp');
    const currentIconElement = document.getElementById('current-weather-icon') as HTMLImageElement;
    const currentApparentElement = document.getElementById('current-weather-apparent');

    if (currentTempElement) {
      currentTempElement.textContent = `${data.current.temperature}°`;
    }

    if (currentApparentElement) {
      currentApparentElement.textContent = `${data.current.apparentTemp}°`;
    }

    if (currentIconElement && data.daily.length > 0) {
      // Use today's weather code for the current weather icon
      currentIconElement.src = `/assets/animated/${data.daily[0].weatherCategory}.svg`;
      currentIconElement.alt = data.daily[0].weatherCategory;
    }

    // Update daily forecast cards
    // This will need to be customized based on your actual DOM structure
    console.log('Weather data ready:', data);

    // You can dispatch a custom event here for other components to listen to
    const event = new CustomEvent('weatherDataReady', { detail: data });
    console.log('publishing weather data', data)
    document.dispatchEvent(event);
  }

  private hideLoader(): void {
    if (this.loaderElement) {
      this.loaderElement.classList.add('hidden');
    }
    if (this.contentElement) {
      this.contentElement.classList.remove('hidden');
    }
  }

  private static wmoCodeToCategory(code: number): WeatherCategory {
    if (code === 0 || code === 1) return WeatherCategory.CLEAR;
    if (code === 2) return WeatherCategory.MID_CLOUDY;
    if (code === 3 || (code >= 45 && code <= 48)) return WeatherCategory.CLOUDY;
    if (code >= 51 && code <= 57) return WeatherCategory.MID_RAINY;
    if ((code >= 61 && code <= 67) || (code >= 80 && code <= 82)) return WeatherCategory.RAINY;
    if (code >= 71 && code <= 74) return WeatherCategory.MID_SNOWY;
    if ((code >= 75 && code <= 77) || (code >= 85 && code <= 86)) return WeatherCategory.SNOWY;
    if (code >= 95 && code <= 99) return WeatherCategory.THUNDERSTORM;
    return WeatherCategory.CLEAR; // default fallback
  }
}

// Initialize weather when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new Weather();
});
