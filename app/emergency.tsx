import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, Alert, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const EmergencyToolkit = () => {
  const emergencyContacts = [
    { name: 'National Disaster Response Force', number: '1078' },
    { name: 'State Emergency Operation Center', number: '1070' },
    { name: 'District Emergency Operation Center', number: '1077' },
    { name: 'Ambulance', number: '108' },
    { name: 'Police', number: '100' },
  ];

  const droneServices = [
    { name: 'Emergency Rescue Drone Helpline', number: '1800-DRONE-911' },
    { name: 'Aerial Medical Supply Delivery', number: '1800-MED-DRONE' },
    { name: 'Drone Search & Rescue Team', number: '1800-FIND-ME' },
  ];

  const safetyTips = [
    'Move to higher ground immediately if in a low-lying area',
    'Stay away from flood waters - just 6 inches of moving water can knock you down',
    'Avoid bridges over fast-moving water',
    'Disconnect electrical appliances if water is entering your home',
    'Do not walk, swim, or drive through flood waters',
    'Stay indoors and away from windows during heavy rainfall',
    'Keep emergency supplies ready including food, water, and medications',
    'Follow evacuation orders from local authorities',
    'Monitor weather updates and emergency broadcasts',
  ];

  const handleEmergencyCall = (number: string, name: string) => {
    Alert.alert(
      'Emergency Call',
      `Are you sure you want to call ${name} (${number})?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Call', 
          onPress: () => {
            const phoneNumber = `tel:${number}`;
            Linking.openURL(phoneNumber)
              .catch(error => {
                console.error('An error occurred', error);
                Alert.alert('Error', 'Could not open phone dialer');
              });
          } 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Cloud Burst Emergency Toolkit</Text>
      </View>
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.warningBox}>
          <Ionicons name="warning" size={24} color="#fff" />
          <Text style={styles.warningText}>
            Cloud bursts are extreme rainfall events that can cause flash floods and landslides.
            Stay alert and follow safety guidelines.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Contacts</Text>
          {emergencyContacts.map((contact, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.contactItem}
              onPress={() => handleEmergencyCall(contact.number, contact.name)}
            >
              <Ionicons name="call" size={20} color="#e74c3c" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{contact.name}</Text>
                <Text style={styles.contactNumber}>{contact.number}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
            </TouchableOpacity>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Drone Emergency Services</Text>
          {droneServices.map((service, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.contactItem}
              onPress={() => handleEmergencyCall(service.number, service.name)}
            >
              <Ionicons name="airplane" size={20} color="#3498db" />
              <View style={styles.contactInfo}>
                <Text style={styles.contactName}>{service.name}</Text>
                <Text style={styles.contactNumber}>{service.number}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
            </TouchableOpacity>
          ))}
          <Text style={styles.droneInfoText}>
            Drone services can provide critical assistance in areas inaccessible by road during floods.
          </Text>
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Safety Tips</Text>
          {safetyTips.map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <Ionicons name="checkmark-circle" size={20} color="#27ae60" />
              <Text style={styles.tipText}>{tip}</Text>
            </View>
          ))}
        </View>
        
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Evacuation Plan</Text>
          <View style={styles.evacuationBox}>
            <Text style={styles.evacuationText}>
              1. Identify safe evacuation routes from your location
            </Text>
            <Text style={styles.evacuationText}>
              2. Know the location of nearest emergency shelters
            </Text>
            <Text style={styles.evacuationText}>
              3. Keep emergency kit ready with essential supplies
            </Text>
            <Text style={styles.evacuationText}>
              4. Have a communication plan with family members
            </Text>
            <Text style={styles.evacuationText}>
              5. Follow instructions from local authorities
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#3498db',
    padding: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
    padding: 16,
  },
  warningBox: {
    backgroundColor: '#e74c3c',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    color: '#fff',
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#2c3e50',
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  contactInfo: {
    flex: 1,
    marginLeft: 12,
  },
  contactName: {
    fontSize: 16,
    color: '#2c3e50',
  },
  contactNumber: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  droneInfoText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontStyle: 'italic',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 15,
    color: '#34495e',
    marginLeft: 10,
    flex: 1,
  },
  evacuationBox: {
    backgroundColor: '#f8f9fa',
    borderRadius: 6,
    padding: 12,
  },
  evacuationText: {
    fontSize: 15,
    color: '#34495e',
    marginBottom: 10,
  },
});

export default EmergencyToolkit;
