import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, Platform, TouchableOpacity, TextInput, ScrollView } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import DropDownPicker from 'react-native-dropdown-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';

const AlertSettingsComponent = () => {
  // Alert configuration states
  const [cloudBurstAlertEnabled, setCloudBurstAlertEnabled] = useState(false);
  const [notificationSound, setNotificationSound] = useState('default');
  const [alertThreshold, setAlertThreshold] = useState('high');
  const [alertFrequency, setAlertFrequency] = useState('immediate');
  const [customMessage, setCustomMessage] = useState('');
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  
  // Dropdown states
  const [soundOpen, setSoundOpen] = useState(false);
  const [thresholdOpen, setThresholdOpen] = useState(false);
  const [frequencyOpen, setFrequencyOpen] = useState(false);

  // Dropdown options
  const soundOptions = [
    { label: 'Default', value: 'default' },
    { label: 'Alert', value: 'alert' },
    { label: 'Siren', value: 'siren' },
    { label: 'Bell', value: 'bell' },
  ];
  
  const thresholdOptions = [
    { label: 'High (Immediate danger)', value: 'high' },
    { label: 'Medium (Potential danger)', value: 'medium' },
    { label: 'Low (Early warning)', value: 'low' },
  ];
  
  const frequencyOptions = [
    { label: 'Immediate', value: 'immediate' },
    { label: 'Every 15 minutes', value: '15min' },
    { label: 'Every 30 minutes', value: '30min' },
    { label: 'Hourly', value: 'hourly' },
  ];

  // Load saved settings
  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('cloudBurstAlertSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        setCloudBurstAlertEnabled(settings.enabled);
        setNotificationSound(settings.sound);
        setAlertThreshold(settings.threshold);
        setAlertFrequency(settings.frequency);
        setCustomMessage(settings.message);
        setVibrationEnabled(settings.vibration);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
    }
  };

  // Save settings
  const saveSettings = async () => {
    try {
      const settings = {
        enabled: cloudBurstAlertEnabled,
        sound: notificationSound,
        threshold: alertThreshold,
        frequency: alertFrequency,
        message: customMessage,
        vibration: vibrationEnabled,
      };
      await AsyncStorage.setItem('cloudBurstAlertSettings', JSON.stringify(settings));
      
      // Show confirmation
      if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
          name: 'default',
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: '#FF231F7C',
        });
      }

      if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        if (finalStatus !== 'granted') {
          alert('Failed to get push token for push notification!');
          return;
        }
      } else {
        alert('Must use physical device for Push Notifications');
      }

      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'CLOUD BURST ALERT',
          body: customMessage || 'Potential cloud burst detected in your area. Take necessary precautions.',
          sound: true,
          badge: 1,
          data: { payload: {} },
          priority: Notifications.AndroidNotificationPriority.MAX
        },
        trigger: null
      });
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  // Play sound directly when testing
  const playSound = async (soundName: string) => {
    try {
      const soundMap: Record<string, any> = {
        'alert': require('../assets/sounds/alert.mp3'),
        'siren': require('../assets/sounds/siren.mp3'),
        'bell': require('../assets/sounds/bell.mp3')
      };
      
      const soundFile = soundMap[soundName];
      if (soundFile) {
        const { sound } = await Audio.Sound.createAsync(soundFile);
        await sound.playAsync();
        
        // Unload sound when finished
        sound.setOnPlaybackStatusUpdate(status => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  // Test notification
  const sendTestNotification = async () => {
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    // Play sound directly when testing
    if (notificationSound !== 'default') {
      await playSound(notificationSound);
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'CLOUD BURST ALERT',
        body: customMessage || 'Potential cloud burst detected in your area. Take necessary precautions.',
        sound: true,
        badge: 1,
        data: { payload: {} },
      },
      trigger: null, // null means show immediately
    });
  };

  // Configure notification behavior
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      priority: Notifications.AndroidNotificationPriority.HIGH,
    }),
  });

  // Add this function to request notification permissions
  async function registerForPushNotificationsAsync() {
    let token;
    
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('alerts', {
        name: 'Alert Notifications',
        description: 'Notifications for weather alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
        sound: 'siren.wav', // Make sure this file exists in your android/app/src/main/res/raw folder
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
    } else {
      alert('Must use physical device for Push Notifications');
    }

    return token;
  }

  // Function to send alert notification
  async function sendAlertNotification(customMessage: any) {
    // Ensure permissions are granted first
    await registerForPushNotificationsAsync();
    
    // Play sound based on user selection
    if (notificationSound !== 'default') {
      await playSound(notificationSound);
    }
    
    // Send notification
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'CLOUD BURST ALERT',
        body: customMessage || 'Potential cloud burst detected in your area. Take necessary precautions.',
        sound: true,
        badge: 1,
        data: { payload: {} },
        priority: Notifications.AndroidNotificationPriority.MAX
      },
      trigger: null
    });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cloud Burst Alert Settings</Text>
      
      <View style={styles.settingRow}>
        <Text style={styles.settingLabel}>Enable Cloud Burst Alerts</Text>
        <Switch
          value={cloudBurstAlertEnabled}
          onValueChange={setCloudBurstAlertEnabled}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
          thumbColor={cloudBurstAlertEnabled ? '#f5dd4b' : '#f4f3f4'}
        />
      </View>
      
      {cloudBurstAlertEnabled && (
        <>
          <View style={styles.settingSection}>
            <Text style={styles.sectionTitle}>Alert Configuration</Text>
            
            <Text style={styles.settingLabel}>Alert Threshold</Text>
            <DropDownPicker
              open={thresholdOpen}
              value={alertThreshold}
              items={thresholdOptions}
              setOpen={setThresholdOpen}
              setValue={setAlertThreshold}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={3000}
              zIndexInverse={1000}
            />
            
            <Text style={styles.settingLabel}>Alert Frequency</Text>
            <DropDownPicker
              open={frequencyOpen}
              value={alertFrequency}
              items={frequencyOptions}
              setOpen={setFrequencyOpen}
              setValue={setAlertFrequency}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={2000}
              zIndexInverse={2000}
            />
            
            <Text style={styles.settingLabel}>Notification Sound</Text>
            <DropDownPicker
              open={soundOpen}
              value={notificationSound}
              items={soundOptions}
              setOpen={setSoundOpen}
              setValue={setNotificationSound}
              style={styles.dropdown}
              dropDownContainerStyle={styles.dropdownContainer}
              zIndex={1000}
              zIndexInverse={3000}
            />
            
            <View style={styles.settingRow}>
              <Text style={styles.settingLabel}>Enable Vibration</Text>
              <Switch
                value={vibrationEnabled}
                onValueChange={setVibrationEnabled}
                trackColor={{ false: '#767577', true: '#81b0ff' }}
                thumbColor={vibrationEnabled ? '#f5dd4b' : '#f4f3f4'}
              />
            </View>
            
            <Text style={styles.settingLabel}>Custom Alert Message (Optional)</Text>
            <TextInput
              style={styles.textInput}
              value={customMessage}
              onChangeText={setCustomMessage}
              placeholder="Enter custom message for notifications"
              multiline
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={saveSettings}>
              <Text style={styles.buttonText}>Save Settings</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.button, styles.testButton]} onPress={sendTestNotification}>
              <Text style={styles.buttonText}>Test Notification</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
      
      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          Cloud burst alerts will be sent to your device's notification bar based on 
          weather data and prediction models. Make sure to grant notification permissions 
          to the app for these alerts to work properly.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  settingLabel: {
    fontSize: 16,
    color: '#333',
    marginVertical: 8,
  },
  settingSection: {
    marginTop: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#34495e',
  },
  dropdown: {
    marginBottom: 20,
    borderColor: '#ddd',
  },
  dropdownContainer: {
    borderColor: '#ddd',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#fff',
    minHeight: 80,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 5,
    flex: 1,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#2ecc71',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  infoContainer: {
    backgroundColor: '#ecf0f1',
    padding: 15,
    borderRadius: 5,
    marginTop: 10,
    marginBottom: 20,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
});

export default AlertSettingsComponent;
