import { StyleSheet, Image, FlatList } from 'react-native';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

export default function ForecastList({ forecast }: { forecast: any[] }) {
  if (!forecast || forecast.length === 0) return null;
  
  const renderForecastItem = ({ item }: { item: any }) => {
    const date = new Date(item.date);
    const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
    
    return (
      <ThemedView style={styles.forecastItem}>
        <ThemedText type="defaultSemiBold">{dayName}</ThemedText>
        <Image 
          source={{ uri: `https:${item.icon}` }} 
          style={styles.forecastIcon} 
        />
        <ThemedView style={styles.tempContainer}>
          <ThemedText>{item.maxTemp}°</ThemedText>
          <ThemedText style={styles.minTemp}>{item.minTemp}°</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  };
  
  return (
    <FlatList
      data={forecast}
      renderItem={renderForecastItem}
      keyExtractor={(item) => item.date}
      horizontal={false}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    marginTop: 8,
  },
  forecastItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  forecastIcon: {
    width: 40,
    height: 40,
  },
  tempContainer: {
    flexDirection: 'row',
    width: 80,
    justifyContent: 'flex-end',
  },
  minTemp: {
    marginLeft: 8,
    opacity: 0.6,
  },
}); 