import { StyleSheet, Image } from 'react-native';

export default function WeatherBackground({ condition }: { condition: string }) {
  // Map weather conditions to background images
  const getBackgroundImage = () => {
    const lowerCondition = condition.toLowerCase();
    
    if (lowerCondition.includes('clear') || lowerCondition.includes('sunny')) {
      return require('@/assets/images/weather/sunny.jpg');
    } else if (lowerCondition.includes('cloud')) {
      return require('@/assets/images/weather/cloudy.jpeg');
    } else if (lowerCondition.includes('rain') || lowerCondition.includes('drizzle')) {
      return require('@/assets/images/weather/rainy.jpg');
    } else if (lowerCondition.includes('snow') || lowerCondition.includes('sleet')) {
      return require('@/assets/images/weather/snowy.jpg');
    } else if (lowerCondition.includes('thunder') || lowerCondition.includes('storm')) {
      return require('@/assets/images/weather/stormy.jpg');
    } else if (lowerCondition.includes('fog') || lowerCondition.includes('mist')) {
      return require('@/assets/images/weather/foggy.jpg');
    } else {
      return require('@/assets/images/weather/default.jpg');
    }
  };

  return (
    <Image
      source={getBackgroundImage()}
      style={styles.backgroundImage}
    />
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    height: '100%',
    width: '100%',
    position: 'absolute',
    opacity: 0.8,
  },
}); 