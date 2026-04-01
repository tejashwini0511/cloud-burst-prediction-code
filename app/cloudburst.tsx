import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { format, parseISO } from 'date-fns';
import { getToken } from '@/utils/meteomatics';
import { getTodayAndTomorrow } from '@/utils/getDate';
import { getLocationData } from '@/utils/getIpAndLocation';

// Define threshold values for cloud burst prediction
const HIGH_THRESHOLDS = {
    cin: 2500, // Convective Inhibition threshold (J/kg)
    relativeHumidity: 60, // Relative Humidity threshold (%)
    isRain: 1, // Rain indicator
    cloudLiquidWater: 1, // Cloud liquid water threshold (kg/m²)
    heavyRainWarning: 1, // Heavy rain warning threshold
    superCooledLiquidWater: 1, // Super cooled liquid water threshold (kg/m²)
  };
  
  const MEDIUM_THRESHOLDS = {
    cin: 1500, // Convective Inhibition threshold (J/kg)
    relativeHumidity: 70, // Relative Humidity threshold (%)
    isRain: 0.5, // Rain indicator
    cloudLiquidWater: 0.5, // Cloud liquid water threshold (kg/m²)   
    heavyRainWarning: 0.5, // Heavy rain warning threshold
    superCooledLiquidWater: 0.5, // Super cooled liquid water threshold (kg/m²)
  };
  
  const LOW_THRESHOLDS = {
    cin: 1000, // Convective Inhibition threshold (J/kg)
    relativeHumidity: 80, // Relative Humidity threshold (%)
    isRain: 0.2, // Rain indicator
    cloudLiquidWater: 0.2, // Cloud liquid water threshold (kg/m²)
    heavyRainWarning: 0.2, // Heavy rain warning threshold
    superCooledLiquidWater: 0.2, // Super cooled liquid water threshold (kg/m²)
};

const CloudBurst = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [riskColor, setRiskColor] = useState('green');
  const [location, setLocation] = useState({ latitude: 12.96559, longitude: 77.60364 });
  const [dangerousPeriods, setDangerousPeriods] = useState<string[]>([]);
  const [cloudBurstPrediction, setCloudBurstPrediction] = useState({
    willOccur: false,
    timeFrames: [] as string[],
    explanation: ''
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = await getToken();
      if (!token?.token) {
        console.error('No token found');
        setLoading(false);
        return null;
      }

      const { today, tomorrow } = getTodayAndTomorrow();
      const { latitude, longitude } = await getLocationData();

      if (latitude && longitude) {
        setLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
      }

      const coordinates = `${latitude},${longitude}`;
      const parameters = 'cin:Jkg,super_cooled_liquid_water:kgm2,cloud_liquid_water:kgm2,is_rain_30min:idx,heavy_rain_warning_1h:idx,relative_humidity_2m:p';
      const url = `https://api.meteomatics.com/${today}T00:00:00Z--${tomorrow}T24:00:00Z:PT1H/${parameters}/${coordinates}/json?access_token=${token?.token}`;

      const response: any = await axios({
        method: 'get',
        url,
      });
      
      if (response?.status === 200) {
        setData(response?.data);
        calculateRiskLevel(response?.data);
        analyzeCloudBurstPotential(response?.data);
        setLoading(false);
        return;
      }
      
      setLoading(false);
      return null;
    } catch (error) {
      setLoading(false);
      console.error('Error fetching data:', error);
      return null;
    }
  };

  const calculateRiskLevel = (weatherData: any) => {
    // Find the data for each parameter
    const cinData = weatherData?.data?.find((item: any) => item.parameter === "cin:Jkg");
    const humidityData = weatherData?.data?.find((item: any) => item.parameter === "relative_humidity_2m:p");
    const rainData = weatherData?.data?.find((item: any) => item.parameter === "is_rain_30min:idx");
    const cloudLiquidData = weatherData?.data?.find((item: any) => item.parameter === "cloud_liquid_water:kgm2");
    const heavyRainData = weatherData?.data?.find((item: any) => item.parameter === "heavy_rain_warning_1h:idx");
    const superCooledLiquidWaterData = weatherData?.data?.find((item: any) => item.parameter === "super_cooled_liquid_water:kgm2");
    
    if (!cinData || !humidityData || !rainData || !cloudLiquidData || !heavyRainData || !superCooledLiquidWaterData) return;
    
    // Get maximum values
    const maxCIN = Math.max(...cinData.coordinates[0].dates.map((d: any) => d.value));
    const maxHumidity = Math.max(...humidityData.coordinates[0].dates.map((d: any) => d.value));
    const hasRain = rainData.coordinates[0].dates.some((d: any) => d.value >= HIGH_THRESHOLDS.isRain);
    const hasHeavyRain = heavyRainData.coordinates[0].dates.some((d: any) => d.value >= HIGH_THRESHOLDS.heavyRainWarning);
    const hasSuperCooledLiquidWater = superCooledLiquidWaterData.coordinates[0].dates.some(
      (d: any) => d.value >= HIGH_THRESHOLDS.superCooledLiquidWater
    );
    const hasCloudLiquidWater = cloudLiquidData.coordinates[0].dates.some(
      (d: any) => d.value >= HIGH_THRESHOLDS.cloudLiquidWater
    );
    
    // Calculate risk level
    if (maxCIN > HIGH_THRESHOLDS.cin && maxHumidity > HIGH_THRESHOLDS.relativeHumidity && 
        hasRain && hasHeavyRain && hasSuperCooledLiquidWater && hasCloudLiquidWater) {
      setRiskLevel('High');
      setRiskColor('red');
    } else if (maxCIN > MEDIUM_THRESHOLDS.cin || 
              (maxHumidity > MEDIUM_THRESHOLDS.relativeHumidity && hasRain && 
               hasCloudLiquidWater)) {
      setRiskLevel('Medium');
      setRiskColor('orange');
    } else {
      setRiskLevel('Low');
      setRiskColor('green');
    }
  };

  const analyzeCloudBurstPotential = (weatherData: any) => {
    // Find the data for each parameter
    const cinData = weatherData?.data?.find((item: any) => item.parameter === "cin:Jkg");
    const humidityData = weatherData?.data?.find((item: any) => item.parameter === "relative_humidity_2m:p");
    const rainData = weatherData?.data?.find((item: any) => item.parameter === "is_rain_30min:idx");
    const cloudLiquidData = weatherData?.data?.find((item: any) => item.parameter === "cloud_liquid_water:kgm2");
    const heavyRainData = weatherData?.data?.find((item: any) => item.parameter === "heavy_rain_warning_1h:idx");
    const superCooledLiquidWaterData = weatherData?.data?.find((item: any) => item.parameter === "super_cooled_liquid_water:kgm2");
    
    if (!cinData || !humidityData || !rainData || !cloudLiquidData || !heavyRainData || !superCooledLiquidWaterData) {
      setCloudBurstPrediction({
        willOccur: false,
        timeFrames: [],
        explanation: "Insufficient data to make a prediction."
      });
      return;
    }
    
    // Find dangerous periods
    const periods: string[] = [];
    const timeFrames: string[] = [];
    
    for (let i = 0; i < cinData.coordinates[0].dates.length; i++) {
      const cinValue = cinData.coordinates[0].dates[i].value;
      const humidityValue = humidityData.coordinates[0].dates[i].value;
      const rainValue = rainData.coordinates[0].dates[i].value;
      const cloudLiquidValue = cloudLiquidData.coordinates[0].dates[i].value;
      const heavyRainValue = heavyRainData.coordinates[0].dates[i].value;
      const superCooledValue = superCooledLiquidWaterData.coordinates[0].dates[i].value;
      const dateTime = format(parseISO(cinData.coordinates[0].dates[i].date), 'yyyy-MM-dd HH:mm');
      
      // Check if all conditions for cloud burst are met
      if (
        cinValue > HIGH_THRESHOLDS.cin && 
        humidityValue > HIGH_THRESHOLDS.relativeHumidity &&
        rainValue >= HIGH_THRESHOLDS.isRain &&
        cloudLiquidValue >= HIGH_THRESHOLDS.cloudLiquidWater &&
        heavyRainValue >= HIGH_THRESHOLDS.heavyRainWarning &&
        superCooledValue >= HIGH_THRESHOLDS.superCooledLiquidWater
      ) {
        periods.push(format(parseISO(cinData.coordinates[0].dates[i].date), 'HH:mm'));
        timeFrames.push(dateTime);
      }
    }
    
    setDangerousPeriods(periods);
    
    // Determine if cloud burst will occur and provide explanation
    let explanation = "";
    if (periods.length > 0) {
      explanation = "Cloud burst conditions are predicted due to high convective inhibition (CIN), " +
                   "high relative humidity, presence of rain, significant cloud liquid water, " +
                   "heavy rain warning, and super cooled liquid water. These conditions together " +
                   "create a high risk for sudden, intense rainfall.";
    } else if (riskLevel === 'Medium') {
      explanation = "Some conditions for cloud burst are present, but not all criteria are met. " +
                   "There is a moderate risk of heavy rainfall, but a full cloud burst is less likely.";
    } else {
      explanation = "Weather conditions do not indicate a risk of cloud burst. " +
                   "Key parameters are below critical thresholds.";
    }
    
    setCloudBurstPrediction({
      willOccur: periods.length > 0,
      timeFrames: timeFrames,
      explanation: explanation
    });
  };

  const getRiskColorStyle = () => {
    switch (riskColor) {
      case 'red': return { backgroundColor: 'rgba(255,0,0,0.2)', textColor: '#FF6666' };
      case 'orange': return { backgroundColor: 'rgba(255,165,0,0.2)', textColor: '#FFAA33' };
      default: return { backgroundColor: 'rgba(0,128,0,0.2)', textColor: '#66FF66' };
    }
  };

  const colorStyle = getRiskColorStyle();

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading cloud burst prediction data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={[styles.container, { backgroundColor: '#121212' }]}>
      <Text style={styles.title}>Cloud Burst Prediction</Text>
      
      <View style={styles.riskSection}>
        <View style={styles.riskLevelRow}>
          <View style={[styles.riskIndicator, { 
            backgroundColor: riskColor === 'green' ? '#66FF66' : riskColor === 'orange' ? '#FFAA33' : '#FF6666' 
          }]} />
          <Text style={[styles.riskLevelText, { color: colorStyle.textColor }]}>
            Risk Level: {riskLevel}
          </Text>
        </View>
        
        <View style={styles.predictionCard}>
          <Text style={styles.sectionTitle}>Prediction:</Text>
          <Text style={styles.predictionText}>
            {cloudBurstPrediction.willOccur 
              ? "Cloud burst conditions are predicted!" 
              : "Cloud burst is not likely to occur."}
          </Text>
          
          <Text style={styles.explanationText}>{cloudBurstPrediction.explanation}</Text>
          
          {cloudBurstPrediction.willOccur && (
            <View>
              <Text style={styles.sectionTitle}>Predicted Time Frames:</Text>
              {cloudBurstPrediction.timeFrames.map((time, index) => (
                <Text key={index} style={styles.timeFrameText}>{time}</Text>
              ))}
            </View>
          )}
        </View>
      </View>
      
      <View style={styles.locationSection}>
        <Text style={styles.sectionTitle}>Location</Text>
        <Text style={styles.locationText}>
          Latitude: {location.latitude.toFixed(4)}, Longitude: {location.longitude.toFixed(4)}
        </Text>
      </View>
      
      {dangerousPeriods.length > 0 && (
        <View style={styles.dangerousPeriodsCard}>
          <Text style={styles.sectionTitle}>Dangerous Time Periods</Text>
          <View style={styles.periodsContainer}>
            {dangerousPeriods.map((period, index) => (
              <View key={index} style={styles.periodBadge}>
                <Text style={styles.periodText}>{period}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
      
      <TouchableOpacity 
        onPress={fetchData} 
        style={styles.refreshButton}
      >
        <Text style={styles.refreshButtonText}>Refresh Data</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#E0E0E0',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#FFFFFF',
  },
  riskSection: {
    marginBottom: 24,
  },
  riskLevelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  riskIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: 8,
  },
  riskLevelText: {
    fontSize: 20,
    fontWeight: '600',
  },
  predictionCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  sectionTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
    color: '#FFFFFF',
  },
  predictionText: {
    marginBottom: 8,
    color: '#E0E0E0',
  },
  explanationText: {
    marginBottom: 16,
    color: '#E0E0E0',
  },
  timeFrameText: {
    color: '#FF6666',
    marginLeft: 16,
    marginBottom: 4,
  },
  locationSection: {
    marginTop: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#E0E0E0',
  },
  dangerousPeriodsCard: {
    marginTop: 16,
    padding: 12,
    backgroundColor: '#1E1E1E',
    borderRadius: 8,
  },
  periodsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  periodBadge: {
    backgroundColor: 'rgba(255, 0, 0, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  periodText: {
    color: '#FF6666',
  },
  refreshButton: {
    marginTop: 24,
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  refreshButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});

export default CloudBurst;
