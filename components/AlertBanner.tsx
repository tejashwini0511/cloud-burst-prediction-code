import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from './ThemedText';
import { ThemedView } from './ThemedView';

interface Alert {
  id: number;
  location: string;
  time: string;
  intensity: string;
  description: string;
}

interface AlertBannerProps {
  alerts: Alert[];
  // onPress: () => void;
}

const AlertBanner = ({ alerts }: AlertBannerProps) => {
  if (!alerts || alerts.length === 0) return null;
  
  return (
    <TouchableOpacity>
      <ThemedView style={styles.alertContainer}>
        <View style={styles.iconContainer}>
          <Ionicons name="warning" size={24} color="#FF9500" />
        </View>
        <View style={styles.alertContent}>
          <ThemedText style={styles.alertTitle}>Cloudburst Alert</ThemedText>
          <ThemedText style={styles.alertText}>
            {/* {alerts[0].description} in {alerts[0].location} ({alerts[0].time}) */}
            No cloudburst alerts found
          </ThemedText>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(255, 149, 0, 0.3)',
  },
  iconContainer: {
    marginRight: 12,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 2,
  },
  alertText: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default AlertBanner;

// weather/app/(tabs)/index.tsx

// ## 2. Now, let's create the FeatureGrid component:


// ## 3. Now, let's create a sample feature screen for Cloudburst Predictions:

// ## Implementation Plan

// To fully implement all the requested features, you'll need to create several more screens:

// 1. **Radar Screen** - For interactive radar map showing cloudburst events
// 2. **Notifications Screen** - For customizing push notification preferences
// 3. **Emergency Toolkit Screen** - For quick access to emergency contacts and resources
// 4. **Community Screen** - For social sharing features
// 5. **Education Screen** - For educational content about cloudbursts and safety

// Each of these would follow a similar pattern to the Cloudburst screen I've provided above.

// ## Navigation Structure

// You should set up a tab-based navigation with:

// 1. Home (main weather screen)
// 2. Radar (interactive map)
// 3. Alerts (notifications and cloudburst predictions)
// 4. Community
// 5. More (containing Emergency Toolkit, Education, Settings)

// ## UI Design Principles Applied

// 1. **Professional Color Scheme** - Using a cohesive blue-based palette with appropriate accent colors
// 2. **Card-Based UI** - Organizing information in clear, distinct cards
// 3. **Consistent Typography** - Using a clear hierarchy with different font weights and sizes
// 4. **Intuitive Icons** - Using recognizable icons for each feature
// 5. **Prominent Alerts** - Making emergency information stand out
// 6. **Grid Layout** - Organizing features in an easy-to-scan grid
// 7. **Responsive Feedback** - Adding touch feedback for all interactive elements

// Would you like me to create any of the other screens mentioned in the implementation plan? Or would you like more details on any specific feature?