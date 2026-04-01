import { StyleSheet, Image, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function WeatherInfo({ data }: { data: any }) {
  
  if (!data) return null;
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type='title' style={styles.temperatureContainer}>
          <ThemedText type="title" >{data.temp}</ThemedText>
          <ThemedText type="subtitle"> °C</ThemedText>
        </ThemedText>
        <Image 
          source={{ uri: `https:${data.icon}` }} 
          style={styles.weatherIcon} 
        />
      </ThemedView>
      
      <ThemedText type="subtitle" style={styles.condition}>
        {data.condition}
      </ThemedText>
      
      <ThemedView style={styles.detailsContainer}>
        <ThemedView style={styles.detailItem}>
          <ThemedText type="defaultSemiBold">Feels Like</ThemedText>
          <ThemedText>{data.feelsLike}°C</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.detailItem}>
          <ThemedText type="defaultSemiBold">Humidity</ThemedText>
          <ThemedText>{data.humidity}%</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.detailItem}>
          <ThemedText type="defaultSemiBold">Wind</ThemedText>
          <ThemedText>{data.windSpeed} km/h</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ThemedText style={styles.lastUpdated}>
        Last updated: {data.lastUpdated}
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  temperatureValue: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  temperatureUnit: {
    fontSize: 24,
  },
  weatherIcon: {
    width: 64,
    height: 64,
  },
  condition: {
    textAlign: 'center',
    marginVertical: 8,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  detailItem: {
    alignItems: 'center',
  },
  lastUpdated: {
    fontSize: 12,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.7,
  },
}); 