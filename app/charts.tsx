"use client";

import React, { useState, useEffect } from 'react';

import { format, parseISO } from 'date-fns';
import axios from 'axios';
import { getTodayAndTomorrow } from '@/utils/getDate';
import { getLocationData } from '@/utils/getIpAndLocation';
import { getToken } from '@/utils/meteomatics';
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView, TouchableOpacity, Platform } from 'react-native';

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

const RadarView = () => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [riskLevel, setRiskLevel] = useState('Low');
  const [riskColor, setRiskColor] = useState('green');
  const [location, setLocation] = useState({ latitude: 12.96559, longitude: 77.60364 });
  const [today, setToday] = useState('');
  const [activeTab, setActiveTab] = React.useState('today');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {

        setLoading(true);
        const token = await getToken();
        console.log('token:', token);
        if (!token?.token) {
            console.error('No token found');
            setLoading(false);
            return null;
        }

        const { today, tomorrow } = getTodayAndTomorrow();

        if(today) {
            setToday(today);
        }

        const { latitude, longitude } = await getLocationData();

        if(latitude && longitude) {
            setLocation({ latitude: parseFloat(latitude), longitude: parseFloat(longitude) });
        }

        const coordinates = `${latitude},${longitude}`;

        const parameters = 'cin:Jkg,super_cooled_liquid_water:kgm2,cloud_liquid_water:kgm2,is_rain_30min:idx,heavy_rain_warning_1h:idx,relative_humidity_2m:p';

        const url = `https://api.meteomatics.com/${today}T00:00:00Z--${tomorrow}T24:00:00Z:PT1H/${parameters}/${coordinates}/json?access_token=${token?.token}`;

        const response: any = await axios({
            method: 'get',
            url,
        })
        if(response?.status === 200) {
            setLoading(false);
            setData(response?.data);      
            calculateRiskLevel(response?.data);
            return;
        }
        setLoading(false);
        return null;

        } catch (error) {
        setLoading(false);
        console.error('Error fetching data:', error);
        return null;
        }
    }

  const calculateRiskLevel = (weatherData: any) => {
    // Find the CIN data
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
    const hasSuperCooledLiquidWater = superCooledLiquidWaterData.coordinates[0].dates.some((d: any) => d.value >= HIGH_THRESHOLDS.superCooledLiquidWater);
    const hasCloudLiquidWater = cloudLiquidData.coordinates[0].dates.some((d: any) => d.value >= HIGH_THRESHOLDS.cloudLiquidWater);
    
    // Calculate risk level
    if (maxCIN > HIGH_THRESHOLDS.cin && maxHumidity > HIGH_THRESHOLDS.relativeHumidity && hasRain && hasHeavyRain && hasSuperCooledLiquidWater && hasCloudLiquidWater) {
      setRiskLevel('High');
      setRiskColor('red');
    } else if (maxCIN > MEDIUM_THRESHOLDS.cin || (maxHumidity > MEDIUM_THRESHOLDS.relativeHumidity && hasRain && hasHeavyRain && hasSuperCooledLiquidWater && hasCloudLiquidWater)) {
      setRiskLevel('Medium');
      setRiskColor('orange');
    } else {
      setRiskLevel('Low');
      setRiskColor('green');
    }
  };

  const formatChartData = (parameter: string) => {
    if (!data) return null;
    
    const paramData = data?.data?.find((item: any) => item?.parameter === parameter);
    if (!paramData) return null;
    
    const dates = paramData?.coordinates[0]?.dates?.map((d: any) => format(parseISO(d.date), 'HH:mm'));
    const values = paramData?.coordinates[0]?.dates?.map((d: any) => d.value);
    
    return { dates, values };
  };

//   if (loading) {
//     return <div className="flex justify-center items-center h-screen">Loading weather data...</div>;
//   }

  const cinData = formatChartData("cin:Jkg");
  const humidityData = formatChartData("relative_humidity_2m:p");
  const rainData = formatChartData("is_rain_30min:idx");
  const cloudLiquidData = formatChartData("cloud_liquid_water:kgm2");
  const heavyRainData = formatChartData("heavy_rain_warning_1h:idx");
  const superCooledLiquidWaterData = formatChartData("super_cooled_liquid_water:kgm2");

  // Find dangerous periods
  const dangerousPeriods: string[] = [];
  if (cinData && humidityData && rainData) {
    for (let i = 0; i < cinData.dates.length; i++) {
      if (
        cinData.values[i] > HIGH_THRESHOLDS.cin && 
        humidityData.values[i] > HIGH_THRESHOLDS.relativeHumidity &&
        (rainData.values[i] >= HIGH_THRESHOLDS.isRain || 
         (cloudLiquidData && cloudLiquidData.values[i] >= HIGH_THRESHOLDS.cloudLiquidWater) ||
         (heavyRainData && heavyRainData.values[i] >= HIGH_THRESHOLDS.heavyRainWarning) ||
         (superCooledLiquidWaterData && superCooledLiquidWaterData.values[i] >= HIGH_THRESHOLDS.superCooledLiquidWater))
      ) {
        dangerousPeriods.push(cinData.dates[i]);
      }
    }
  }

  // Get risk color values for styling
  const getRiskColorStyle = () => {
    switch (riskColor) {
      case 'red': return { backgroundColor: 'rgba(255,0,0,0.1)', textColor: '#FF0000', gradient: ['#FFE0E0', '#FFF5F5'] };
      case 'orange': return { backgroundColor: 'rgba(255,165,0,0.1)', textColor: '#FFA500', gradient: ['#FFF0E0', '#FFFAF5'] };
      default: return { backgroundColor: 'rgba(0,128,0,0.1)', textColor: '#008000', gradient: ['#E0FFE0', '#F5FFF5'] };
    }
  };

  const colorStyle = getRiskColorStyle();
  
  // Split data into today and tomorrow
  const splitData = (data: any) => {
    if (!data) return { today: null, tomorrow: null };
    
    const midpoint = Math.ceil(data.dates.length / 2);
    
    return {
      today: {
        values: data.values.slice(0, midpoint),
        dates: data.dates.slice(0, midpoint)
      },
      tomorrow: {
        values: data.values.slice(midpoint),
        dates: data.dates.slice(midpoint)
      }
    };
  };
  
  const cinSplit = splitData(cinData);
  const humiditySplit = splitData(humidityData);
  const rainSplit = splitData(rainData);
  const cloudLiquidSplit = splitData(cloudLiquidData);
  const heavyRainSplit = splitData(heavyRainData);
  const superCooledLiquidWaterSplit = splitData(superCooledLiquidWaterData);

  // Create a reusable chart component with multiple thresholds
  const WeatherChart = ({ title, data, color, parameter }: { title: string, data: any, color: string, parameter: string }) => {
    if (!data || !data.dates || !data.values) return null;
    
    // Get the appropriate threshold values based on parameter
    const highThreshold = parameter === 'cin:Jkg' ? HIGH_THRESHOLDS.cin : 
                          parameter === 'relative_humidity_2m:p' ? HIGH_THRESHOLDS.relativeHumidity :
                          parameter === 'is_rain_30min:idx' ? HIGH_THRESHOLDS.isRain :
                          parameter === 'cloud_liquid_water:kgm2' ? HIGH_THRESHOLDS.cloudLiquidWater :
                          parameter === 'heavy_rain_warning_1h:idx' ? HIGH_THRESHOLDS.heavyRainWarning :
                          parameter === 'super_cooled_liquid_water:kgm2' ? HIGH_THRESHOLDS.superCooledLiquidWater : null;
                          
    const mediumThreshold = parameter === 'cin:Jkg' ? MEDIUM_THRESHOLDS.cin : 
                            parameter === 'relative_humidity_2m:p' ? MEDIUM_THRESHOLDS.relativeHumidity :
                            parameter === 'is_rain_30min:idx' ? MEDIUM_THRESHOLDS.isRain :
                            parameter === 'cloud_liquid_water:kgm2' ? MEDIUM_THRESHOLDS.cloudLiquidWater :
                            parameter === 'heavy_rain_warning_1h:idx' ? MEDIUM_THRESHOLDS.heavyRainWarning :
                            parameter === 'super_cooled_liquid_water:kgm2' ? MEDIUM_THRESHOLDS.superCooledLiquidWater : null;
                            
    const lowThreshold = parameter === 'cin:Jkg' ? LOW_THRESHOLDS.cin : 
                         parameter === 'relative_humidity_2m:p' ? LOW_THRESHOLDS.relativeHumidity :
                         parameter === 'is_rain_30min:idx' ? LOW_THRESHOLDS.isRain :
                         parameter === 'cloud_liquid_water:kgm2' ? LOW_THRESHOLDS.cloudLiquidWater :
                         parameter === 'heavy_rain_warning_1h:idx' ? LOW_THRESHOLDS.heavyRainWarning :
                         parameter === 'super_cooled_liquid_water:kgm2' ? LOW_THRESHOLDS.superCooledLiquidWater : null;
    
    // Calculate max value for scaling
    const maxValue = Math.max(...data.values, highThreshold || 0) * 1.1;
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>{title}</Text>
        
        {/* Simple Bar Chart */}
        <View style={styles.chartWrapper}>
          {/* Y-axis label */}
          <View style={styles.yAxis}>
            <Text style={styles.axisLabel}>{maxValue.toFixed(1)}</Text>
            <Text style={styles.axisLabel}>{(maxValue/2).toFixed(1)}</Text>
            <Text style={styles.axisLabel}>0</Text>
          </View>
          
          {/* Chart bars */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.barsContainer}>
              {data.values.map((value: number, index: number) => (
                <View key={index} style={styles.barWrapper}>
                  <View 
                    style={[
                      styles.bar, 
                      { 
                        height: (value / maxValue) * 150,
                        backgroundColor: color
                      }
                    ]} 
                  />
                  <Text style={styles.barLabel}>{data.dates[index]}</Text>
                </View>
              ))}
              
              {/* Threshold lines */}
              {highThreshold && (
                <View 
                  style={[
                    styles.thresholdLine, 
                    { 
                      bottom: (highThreshold / maxValue) * 150,
                      backgroundColor: 'rgba(255, 0, 0, 0.5)',
                      borderColor: 'red'
                    }
                  ]} 
                />
              )}
              {mediumThreshold && (
                <View 
                  style={[
                    styles.thresholdLine, 
                    { 
                      bottom: (mediumThreshold / maxValue) * 150,
                      backgroundColor: 'rgba(255, 165, 0, 0.5)',
                      borderColor: 'orange'
                    }
                  ]} 
                />
              )}
              {lowThreshold && (
                <View 
                  style={[
                    styles.thresholdLine, 
                    { 
                      bottom: (lowThreshold / maxValue) * 150,
                      backgroundColor: 'rgba(0, 128, 0, 0.5)',
                      borderColor: 'green'
                    }
                  ]} 
                />
              )}
            </View>
          </ScrollView>
        </View>
        
        {/* Legend for thresholds */}
        <View style={styles.thresholdLegend}>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'red' }]} />
            <Text style={styles.legendText}>High</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'orange' }]} />
            <Text style={styles.legendText}>Medium</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendColor, { backgroundColor: 'green' }]} />
            <Text style={styles.legendText}>Low</Text>
          </View>
        </View>
      </View>
    );
  };

  // Create a risk indicator component
  const RiskIndicator = () => (
    <View style={[styles.riskContainer, { backgroundColor: colorStyle.backgroundColor }]}>
      <Text style={styles.riskTitle}>Cloud Burst Risk Level</Text>
      <View style={[styles.riskBadge, { backgroundColor: riskColor }]}>
        <Text style={styles.riskText}>{riskLevel}</Text>
      </View>
      {dangerousPeriods.length > 0 && (
        <View style={styles.dangerousPeriodsContainer}>
          <Text style={styles.dangerousPeriodsTitle}>High Risk Periods:</Text>
          <Text style={styles.dangerousPeriodsList}>
            {dangerousPeriods.join(', ')}
          </Text>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.header}>Weather Analysis</Text>
        
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text>Loading weather data...</Text>
          </View>
        ) : (
          <>
            <RiskIndicator />
            
            {/* Tab selector for today/tomorrow */}
            <View style={styles.tabContainer}>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'today' && styles.activeTab]} 
                onPress={() => setActiveTab('today')}
              >
                <Text style={[styles.tabText, activeTab === 'today' && styles.activeTabText]}>Today</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.tab, activeTab === 'tomorrow' && styles.activeTab]} 
                onPress={() => setActiveTab('tomorrow')}
              >
                <Text style={[styles.tabText, activeTab === 'tomorrow' && styles.activeTabText]}>Tomorrow</Text>
              </TouchableOpacity>
            </View>
            
            {/* Charts */}
            <WeatherChart 
              title="Convective Inhibition (J/kg)" 
              data={activeTab === 'today' ? cinSplit.today : cinSplit.tomorrow} 
              color="#FF6384"
              parameter="cin:Jkg"
            />
            
            <WeatherChart 
              title="Relative Humidity (%)" 
              data={activeTab === 'today' ? humiditySplit.today : humiditySplit.tomorrow} 
              color="#36A2EB"
              parameter="relative_humidity_2m:p"
            />
            
            <WeatherChart 
              title="Rain Indicator" 
              data={activeTab === 'today' ? rainSplit.today : rainSplit.tomorrow} 
              color="#4BC0C0"
              parameter="is_rain_30min:idx"
            />
            
            <WeatherChart 
              title="Cloud Liquid Water (kg/m²)" 
              data={activeTab === 'today' ? cloudLiquidSplit.today : cloudLiquidSplit.tomorrow} 
              color="#9966FF"
              parameter="cloud_liquid_water:kgm2"
            />
            
            <WeatherChart
              title="Heavy Rain Warning" 
              data={activeTab === 'today' ? heavyRainSplit.today : heavyRainSplit.tomorrow} 
              color="#FF9F40"
              parameter="heavy_rain_warning_1h:idx"
            />
            
            <WeatherChart 
              title="Super Cooled Liquid Water (kg/m²)" 
              data={activeTab === 'today' ? superCooledLiquidWaterSplit.today : superCooledLiquidWaterSplit.tomorrow} 
              color="#FFCD56"
              parameter="super_cooled_liquid_water:kgm2"
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 300,
  },
  riskContainer: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: 'center',
  },
  riskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  riskBadge: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  riskText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  dangerousPeriodsContainer: {
    marginTop: 15,
    alignItems: 'center',
  },
  dangerousPeriodsTitle: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  dangerousPeriodsList: {
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  activeTab: {
    backgroundColor: '#2196F3',
  },
  tabText: {
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
  },
  chartWrapper: {
    flexDirection: 'row',
    height: 200,
    marginTop: 10,
  },
  yAxis: {
    width: 40,
    height: 150,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 5,
  },
  axisLabel: {
    fontSize: 10,
    color: '#666',
  },
  barsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    paddingLeft: 5,
    position: 'relative',
  },
  barWrapper: {
    alignItems: 'center',
    marginHorizontal: 5,
    width: 30,
  },
  bar: {
    width: 20,
    minHeight: 1,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  barLabel: {
    fontSize: 9,
    marginTop: 5,
    color: '#666',
  },
  thresholdLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
    borderWidth: 1,
    borderColor: 'red',
    borderStyle: 'dashed',
  },
  chartContainer: {
    marginBottom: 25,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  chart: {
    borderRadius: 10,
    marginVertical: 8,
  },
  thresholdLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendColor: {
    width: 12,
    height: 4,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
});

export default RadarView;