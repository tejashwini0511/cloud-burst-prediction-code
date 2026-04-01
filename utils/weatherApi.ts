import axios from 'axios';

const API_KEY = '972d1f6888604a9684162500252204';
const BASE_URL = 'https://api.weatherapi.com/v1';

export const fetchWeatherData = async (location: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/forecast.json`, {
      params: {
        key: API_KEY,
        q: location,
        days: 5,
        aqi: 'no',
        alerts: 'no'
      }
    });
    
    return {
      current: {
        temp: response.data.current.temp_c || 23.5,
        feelsLike: response.data.current.feelslike_c || 23.5,
        humidity: response.data.current.humidity || 50,
        windSpeed: response.data.current.wind_kph || 10,
        condition: response.data.current.condition.text || 'Sunny',
        icon: response.data.current.condition.icon || 'https://cdn.weatherapi.com/weather/64x64/day/113.png',
        lastUpdated: response.data.current.last_updated || '2025-04-24 12:00:00'
      },
      forecast: response.data.forecast.forecastday.map((day: any) => ({
        date: day.date || '2025-04-24',
        maxTemp: day.day.maxtemp_c || 23.5,
        minTemp: day.day.mintemp_c || 23.5,
        condition: day.day.condition.text || 'Sunny',
        icon: day.day.condition.icon || 'https://cdn.weatherapi.com/weather/64x64/day/113.png'
      }))
    };
  } catch (error: any) {
    console.log(error?.response?.data);
    console.log(error?.message);
    console.error('Error fetching weather data:', error);
    throw error;
  }
}; 