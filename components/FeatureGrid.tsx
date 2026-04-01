import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface FeatureGridProps {
  onFeaturePress: (route: string) => void;
}

const FeatureGrid = ({ onFeaturePress }: FeatureGridProps) => {
  const features = [
    {
      id: 'cloudburst',
      title: 'Cloudburst Predictions',
      icon: 'cloud-outline',
      route: '/cloudburst',
      color: '#4A90E2'
    },
    {
      id: 'charts',
      title: 'Interactive Charts',
      icon: 'bar-chart-outline',
      route: '/charts',
      color: '#5AC8FA'
    },
    {
      id: 'notifications',
      title: 'Alert Settings',
      icon: 'notifications-outline',
      route: '/notifications',
      color: '#FF9500'
    },
    {
      id: 'emergency',
      title: 'Emergency Toolkit',
      icon: 'medkit-outline',
      route: '/emergency',
      color: '#FF3B30'
    },
    {
      id: 'community',
      title: 'Community',
      icon: 'people-outline',
      route: '/community',
      color: '#34C759'
    },
    {
      id: 'education',
      title: 'Weather Education',
      icon: 'book-outline',
      route: '/education',
      color: '#AF52DE'
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="subtitle" style={styles.sectionTitle}>
        Weather Tools
      </ThemedText>
      <View style={styles.grid}>
        {features.map((feature) => (
          <TouchableOpacity
            key={feature.id}
            style={styles.featureItem}
            onPress={() => onFeaturePress(feature.route)}
          >
            <View style={[styles.iconContainer, { backgroundColor: feature.color + '20' }]}>
              <Ionicons name={feature.icon as any} size={24} color={feature.color} />
            </View>
            <ThemedText style={styles.featureTitle}>{feature.title}</ThemedText>
          </TouchableOpacity>
        ))}
      </View>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 16,
  },
  sectionTitle: {
    fontWeight: '600',
    marginBottom: 12,
    fontSize: 18,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  featureItem: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureTitle: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: 14,
  },
});

export default FeatureGrid;