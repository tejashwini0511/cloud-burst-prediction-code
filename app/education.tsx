import React from 'react';
import { View, Text, ScrollView, StyleSheet, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CloudburstEducation = () => {
  return (
    <ScrollView style={styles.container}>
      <LinearGradient
        colors={['#1e3c72', '#2a5298', '#2a5298']}
        style={styles.headerGradient}
      >
        <View style={styles.headerContent}>
          <MaterialCommunityIcons name="weather-lightning-rainy" size={48} color="white" />
          <Text style={styles.headerTitle}>Understanding Cloudbursts</Text>
          <Text style={styles.headerSubtitle}>Extreme rainfall events and how to stay safe</Text>
        </View>
      </LinearGradient>

      <View style={styles.weatherInfoCard}>
        <View style={styles.weatherInfoRow}>
          <View style={styles.weatherInfoItem}>
            <MaterialCommunityIcons name="water" size={24} color="#1e3c72" />
            <Text style={styles.weatherInfoValue}>100mm+</Text>
            <Text style={styles.weatherInfoLabel}>Rainfall</Text>
          </View>
          <View style={styles.weatherInfoItem}>
            <MaterialCommunityIcons name="clock-outline" size={24} color="#1e3c72" />
            <Text style={styles.weatherInfoValue}>1 hour</Text>
            <Text style={styles.weatherInfoLabel}>Duration</Text>
          </View>
          <View style={styles.weatherInfoItem}>
            <MaterialCommunityIcons name="alert-outline" size={24} color="#1e3c72" />
            <Text style={styles.weatherInfoValue}>High</Text>
            <Text style={styles.weatherInfoLabel}>Risk Level</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="information-outline" size={24} color="#1e3c72" />
          <Text style={styles.sectionTitle}>What is a Cloudburst?</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardText}>
            A cloudburst is an extreme weather event characterized by sudden, very heavy rainfall 
            concentrated over a small area. These events typically deliver more than 100mm (4 inches) 
            of rain within an hour, equivalent to a month's worth of rainfall in some regions.
          </Text>
          <Image 
            source={{uri: 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'}} 
            style={styles.cardImage}
            resizeMode="cover"
          />
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="calendar-clock" size={24} color="#1e3c72" />
          <Text style={styles.sectionTitle}>When Do Cloudbursts Occur?</Text>
        </View>
        <View style={styles.conditionsContainer}>
          {[
            { icon: 'water-percent' as const, title: 'High Humidity', description: 'Excessive moisture in the atmosphere provides the water needed for heavy precipitation.' },
            { icon: 'arrow-up-bold' as const, title: 'Unstable Air', description: 'Warm air near the ground rises rapidly through cooler air above it.' },
            { icon: 'weather-lightning' as const, title: 'Convective Activity', description: 'Strong upward air currents carry moisture to high altitudes quickly.' },
            { icon: 'thermometer' as const, title: 'Rapid Cooling', description: 'Fast cooling of moisture-laden air causes water vapor to condense rapidly.' },
            { icon: 'terrain' as const, title: 'Mountainous Terrain', description: 'Mountains can force air upward, enhancing cloud formation and precipitation.' }
          ].map((item, index) => (
            <View key={index} style={styles.conditionCard}>
              <LinearGradient
                colors={['#1e3c72', '#2a5298']}
                style={styles.conditionIconContainer}
              >
                <MaterialCommunityIcons name={item.icon} size={28} color="white" />
              </LinearGradient>
              <Text style={styles.conditionTitle}>{item.title}</Text>
              <Text style={styles.conditionDescription}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.weatherMapSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="map" size={24} color="#1e3c72" />
          <Text style={styles.sectionTitle}>Cloudburst Prone Regions</Text>
        </View>
        <View style={styles.weatherMapCard}>
          <Image 
            source={{uri: 'https://images.unsplash.com/photo-1576502200916-3808e07386a5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80'}} 
            style={styles.weatherMapImage}
            resizeMode="cover"
          />
          <View style={styles.weatherMapOverlay}>
            <Text style={styles.weatherMapText}>
              Mountainous regions and areas with monsoon climates are particularly susceptible to cloudbursts.
              Urban areas with poor drainage systems are at high risk for flash flooding during these events.
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="alert-circle" size={24} color="#e74c3c" />
          <Text style={styles.sectionTitle}>Dangers of Cloudbursts</Text>
        </View>
        <View style={styles.dangerCard}>
          <LinearGradient
            colors={['#e74c3c', '#c0392b']}
            style={styles.dangerGradient}
          >
            <Text style={styles.dangerText}>
              Cloudbursts can trigger flash floods, landslides, and mudslides with little warning. 
              Urban areas are particularly vulnerable due to concrete surfaces that prevent water absorption, 
              while mountainous regions face risks of debris flows and landslides.
            </Text>
          </LinearGradient>
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="shield-check" size={24} color="#1e3c72" />
          <Text style={styles.sectionTitle}>How to Stay Safe</Text>
        </View>
        <View style={styles.safetyContainer}>
          {[
            { icon: 'weather-cloudy-alert' as const, title: 'Stay Informed', description: 'Monitor weather forecasts and alerts, especially during monsoon seasons.' },
            { icon: 'home' as const, title: 'Seek Shelter', description: 'Move to higher ground immediately if you notice rapidly rising water.' },
            { icon: 'car' as const, title: 'Avoid Driving', description: 'Never drive through flooded roads - just 6 inches of water can cause loss of control.' },
            { icon: 'power-plug-off' as const, title: 'Electrical Safety', description: 'Stay away from power lines and electrical equipment during flooding.' },
            { icon: 'phone' as const, title: 'Emergency Contacts', description: 'Keep emergency numbers handy and have an evacuation plan ready.' },
            { icon: 'bag-personal' as const, title: 'Emergency Kit', description: 'Maintain an emergency kit with essentials like water, food, and first aid supplies.' }
          ].map((item, index) => (
            <View key={index} style={styles.safetyCard}>
              <LinearGradient
                colors={['#1e3c72', '#2a5298']}
                style={styles.safetyGradient}
              >
                <MaterialCommunityIcons name={item.icon} size={24} color="#fff" style={styles.safetyIcon} />
                <View style={styles.safetyContent}>
                  <Text style={styles.safetyTitle}>{item.title}</Text>
                  <Text style={styles.safetyDescription}>{item.description}</Text>
                </View>
              </LinearGradient>
            </View>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="lightbulb-on" size={24} color="#1e3c72" />
          <Text style={styles.sectionTitle}>Did You Know?</Text>
        </View>
        <LinearGradient
          colors={['#1e3c72', '#2a5298']}
          style={styles.factCard}
        >
          <Text style={styles.factText}>
            • The highest recorded cloudburst in India dropped 370mm of rain in just 1 hour in Leh in 2010.
          </Text>
          <Text style={styles.factText}>
            • Climate change is increasing the frequency and intensity of cloudbursts worldwide.
          </Text>
          <Text style={styles.factText}>
            • Cloudbursts often occur in the late afternoon when the atmosphere is most unstable.
          </Text>
          <Text style={styles.factText}>
            • The sound of heavy rain during a cloudburst can exceed 100 decibels - as loud as a motorcycle!
          </Text>
        </LinearGradient>
      </View>

      <View style={styles.weatherDataSection}>
        <View style={styles.sectionHeader}>
          <MaterialCommunityIcons name="chart-bar" size={24} color="#1e3c72" />
          <Text style={styles.sectionTitle}>Cloudburst Weather Data</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weatherDataContainer}>
          {[
            { label: 'Rainfall Intensity', value: '100+ mm/hr', icon: 'weather-pouring' as const },
            { label: 'Wind Speed', value: '30-60 km/h', icon: 'weather-windy' as const },
            { label: 'Visibility', value: '<500m', icon: 'eye-outline' as const },
            { label: 'Pressure Drop', value: 'Rapid', icon: 'arrow-down-bold' as const },
            { label: 'Lightning', value: 'Frequent', icon: 'weather-lightning' as const }
          ].map((item, index) => (
            <View key={index} style={styles.weatherDataCard}>
              <MaterialCommunityIcons name={item.icon} size={32} color="#1e3c72" />
              <Text style={styles.weatherDataValue}>{item.value}</Text>
              <Text style={styles.weatherDataLabel}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <LinearGradient
          colors={['rgba(30, 60, 114, 0.1)', 'rgba(42, 82, 152, 0.2)']}
          style={styles.footerGradient}
        >
          <MaterialCommunityIcons name="shield-alert" size={24} color="#1e3c72" style={styles.footerIcon} />
          <Text style={styles.footerText}>
            Stay safe during extreme weather events. This information is provided as educational content 
            and should be used alongside official weather warnings and alerts.
          </Text>
        </LinearGradient>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  headerGradient: {
    padding: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    marginBottom: 16,
    elevation: 8,
  },
  headerContent: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 12,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    marginTop: 8,
  },
  weatherInfoCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 16,
    padding: 16,
    elevation: 4,
  },
  weatherInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherInfoItem: {
    alignItems: 'center',
    flex: 1,
  },
  weatherInfoValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  weatherInfoLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  section: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 8,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    elevation: 4,
  },
  cardText: {
    fontSize: 15,
    color: '#444',
    lineHeight: 22,
    marginBottom: 16,
  },
  cardImage: {
    height: 180,
    borderRadius: 12,
    width: '100%',
  },
  conditionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  conditionCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    elevation: 4,
  },
  conditionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  conditionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  conditionDescription: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
  weatherMapSection: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  weatherMapCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  weatherMapImage: {
    height: 200,
    width: '100%',
  },
  weatherMapOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 16,
  },
  weatherMapText: {
    color: 'white',
    fontSize: 14,
    lineHeight: 20,
  },
  dangerCard: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
  },
  dangerGradient: {
    padding: 20,
  },
  dangerText: {
    fontSize: 15,
    color: 'white',
    lineHeight: 22,
  },
  safetyContainer: {
    marginTop: 8,
  },
  safetyCard: {
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  safetyGradient: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  safetyIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 12,
    marginRight: 16,
  },
  safetyContent: {
    flex: 1,
  },
  safetyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  safetyDescription: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    lineHeight: 20,
  },
  factCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 4,
  },
  factText: {
    fontSize: 14,
    color: 'white',
    marginBottom: 12,
    lineHeight: 20,
  },
  weatherDataSection: {
    marginHorizontal: 16,
    marginVertical: 12,
  },
  weatherDataContainer: {
    flexDirection: 'row',
    marginBottom: 8,
    paddingVertical: 8,
  },
  weatherDataCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    width: 140,
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginVertical: 4,
  },
  weatherDataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 12,
    marginBottom: 4,
  },
  weatherDataLabel: {
    fontSize: 12,
    color: '#666',
  },
  footer: {
    margin: 24,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
  },
  footerGradient: {
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerIcon: {
    marginRight: 16,
  },
  footerText: {
    flex: 1,
    fontSize: 14,
    color: '#444',
    fontStyle: 'italic',
    lineHeight: 20,
  },
});

export default CloudburstEducation;
