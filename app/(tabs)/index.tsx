import { StyleSheet, Platform, ActivityIndicator, TouchableOpacity, View } from 'react-native';
import { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ForecastList from '@/components/ForecastList';
import LocationSearch from '@/components/LocationSearch';
import { fetchWeatherData } from '@/utils/weatherApi';
import WeatherInfo from '@/components/WeatherInfo';
import WeatherBackground from '@/components/WeatherBackground';
import AlertBanner from '@/components/AlertBanner';
import FeatureGrid from '@/components/FeatureGrid';
import React from 'react';

export default function HomeScreen() {
  const [weatherData, setWeatherData] = useState<any>(null);
  const [forecast, setForecast] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('Bangalore, Karnataka, India');
  const [error, setError] = useState<string | null>(null);
  const [cloudburstAlerts, setCloudburstAlerts] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    loadWeatherData(location);

    if (location) {
      setCloudburstAlerts([
        {
          id: 1,
          location: location,
          time: '2 hours from now',
          intensity: 'High',
          description: 'Potential cloudburst event with heavy rainfall expected'
        }
      ]);
    }
  }, [location]);

  const loadWeatherData = async (searchLocation: string) => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchWeatherData(searchLocation);
      setWeatherData(data.current);
      setForecast(data.forecast);
      setLoading(false);
    } catch (err) {
      setError('Failed to load weather data');
      setLoading(false);
      console.error(err);
    }
  };

  const navigateToFeature = (route: string) => {
    console.log('Navigating to:', route);
    router.push(route as any);
  };

  return (
    <>
      <StatusBar style="auto" />
      <ParallaxScrollView
        headerBackgroundColor={{ light: '#4A90E2', dark: '#1D3D47' }}
        headerImage={
          weatherData && 
          <WeatherBackground condition={weatherData.condition} />
        }>
        
        <ThemedView style={styles.container}>
          <LocationSearch 
            onSubmit={setLocation} 
            initialLocation={location} 
          />
          
          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
          ) : error ? (
            <ThemedText style={styles.errorText}>{error}</ThemedText>
          ) : (
            <>
              {cloudburstAlerts.length > 0 && (
                <AlertBanner  alerts={cloudburstAlerts} />
              )}
              
              <WeatherInfo data={weatherData} />
              
              <FeatureGrid 
                onFeaturePress={navigateToFeature}
              />
              
              <ThemedText type="subtitle" style={styles.forecastTitle}>
                5-Day Forecast
              </ThemedText>
              <ForecastList forecast={forecast} />
            </>
          )}
        </ThemedView>
      </ParallaxScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  loader: {
    marginTop: 50,
  },
  errorText: {
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '500',
  },
  forecastTitle: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: '600',
  },
});
