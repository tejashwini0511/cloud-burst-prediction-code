import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import Animated from 'react-native-reanimated';

const Community = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [customMessage, setCustomMessage] = useState('🚨 CLOUDBURST ALERT! 🚨 Experiencing extremely heavy rainfall and flooding in my area. Taking shelter now. Please stay indoors and away from low-lying areas! 💦 Will update when safe. 🙏');
  const [newMessage, setNewMessage] = useState('');
  const [savedMessages, setSavedMessages] = useState<string[]>([]);

  // Default emergency message
  const defaultMessage = "🚨 CLOUDBURST ALERT! 🚨 Experiencing extremely heavy rainfall and flooding in my area. Taking shelter now. Please stay indoors and away from low-lying areas! 💦 Will update when safe. 🙏";

  // List of social media apps to share with
  const socialApps = [
    { name: 'WhatsApp', icon: 'whatsapp' as const, color: '#25D366', package: 'whatsapp://' },
    { name: 'Facebook', icon: 'facebook' as const, color: '#3b5998', package: 'https://www.facebook.com/sharer/sharer.php' },
    { name: 'Twitter', icon: 'twitter' as const, color: '#1DA1F2', package: 'https://twitter.com/intent/tweet' },
    { name: 'Telegram', icon: 'telegram' as const, color: '#0088cc', package: 'https://t.me/share/url' },
    { name: 'Instagram', icon: 'instagram' as const, color: '#C13584', package: 'instagram://' },
  ];

  // Load saved custom messages on component mount
  useEffect(() => {
    loadSavedMessages();
  }, []);

  // Function to load saved messages from storage
  const loadSavedMessages = async () => {
    try {
      const messages = await AsyncStorage.getItem('customAlertMessages');
      if (messages) {
        setSavedMessages(JSON.parse(messages));
      }
    } catch (error) {
      console.error('Error loading saved messages:', error);
    }
  };

  // Function to save a new custom message
  const saveCustomMessage = async () => {
    if (!customMessage.trim()) {
      Alert.alert('Error', 'Please enter a message');
      return;
    }

    try {
      const updatedMessages = [...savedMessages, customMessage];
      await AsyncStorage.setItem('customAlertMessages', JSON.stringify(updatedMessages));
      setSavedMessages(updatedMessages);
      setCustomMessage('');
      Alert.alert('Success', 'Message saved successfully');
    } catch (error) {
      console.error('Error saving message:', error);
      Alert.alert('Error', 'Failed to save message');
    }
  };

  // Function to show social app selector
  const showSocialAppSelector = () => {
    setModalVisible(true);
  };

  // Function to share message via selected app
  const shareMessage = (appPackage: string, appName: string, message: string) => {
    const encodedMessage = encodeURIComponent(message);
    let url = '';
    
    if (appName === 'WhatsApp') {
      url = `${appPackage}send?text=${encodedMessage}`;
    } else if (appName === 'Facebook') {
      url = `${appPackage}?u=https://yourapp.com&quote=${encodedMessage}`;
    } else if (appName === 'Twitter') {
      url = `${appPackage}?text=${encodedMessage}`;
    } else if (appName === 'Telegram') {
      url = `${appPackage}?url=https://yourapp.com&text=${encodedMessage}`;
    } else {
      url = appPackage;
    }

    Linking.canOpenURL(url)
      .then(supported => {
        if (supported) {
          return Linking.openURL(url);
        } else {
          Alert.alert(
            'App Not Installed',
            `${appName} is not installed on your device.`,
            [{ text: 'OK' }]
          );
        }
      })
      .catch(error => {
        console.error('Error opening app:', error);
        Alert.alert('Error', `Could not open ${appName}`);
      });
  };

  // Function to update custom message with new message
  const updateCustomMessage = () => {
    if (newMessage.trim()) {
      setCustomMessage(newMessage);
      setNewMessage('');
      Alert.alert('Success', 'Message updated successfully');
    } else {
      Alert.alert('Error', 'Please enter a message');
    }
  };

  return (
    <View style={styles.container}>
      {/* Removed the Community header */}
      
      {/* Custom message display section */}
      <View style={styles.messageSection}>
        <Text style={styles.sectionTitle}>Your Custom Alert Message:</Text>
        <View style={styles.messageContainer}>
          <Text style={styles.messageText}>{customMessage}</Text>
        </View>
        
        {/* Send button for displayed message */}
        <TouchableOpacity 
          style={[styles.sendButton, styles.primaryButton]} 
          onPress={showSocialAppSelector}
        >
          <Text style={styles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </View>
      
      {/* New message input section */}
      <View style={styles.inputSection}>
        <Text style={styles.sectionTitle}>Type New Message:</Text>
        <TextInput
          style={styles.textInput}
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
          placeholder="Type your message here..."
        />
        
        {/* Send button for new message */}
        <TouchableOpacity 
          style={[styles.sendButton, styles.secondaryButton]} 
          onPress={updateCustomMessage}
        >
          <Text style={styles.buttonText}>Update Message</Text>
        </TouchableOpacity>
      </View>
      
      {/* Social apps section */}
      <View style={styles.socialSection}>
        <Text style={styles.sectionTitle}>Share via:</Text>
        <View style={styles.socialIconsContainer}>
          {socialApps.map((app, index) => (
            <TouchableOpacity 
              key={index}
              style={styles.socialIcon} 
              onPress={() => shareMessage(app.package, app.name, customMessage)}
            >
              <View style={[styles.iconBackground, {backgroundColor: app.color}]}>
                <FontAwesome name={app.icon} size={24} color="white" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Share Modal */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Animated.View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Share via</Text>
              <TouchableOpacity 
                style={styles.closeButton} 
                onPress={() => setModalVisible(false)}
              >
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalAppsGrid}>
              {socialApps.map((app, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.modalAppIcon} 
                  onPress={() => {
                    shareMessage(app.package, app.name, customMessage);
                    setModalVisible(false);
                  }}
                >
                  <View style={[styles.modalIconBackground, {backgroundColor: app.color}]}>
                    <FontAwesome name={app.icon} size={28} color="white" />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
    paddingTop: 40, // Added extra padding at top since we removed the header
  },
  messageSection: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  inputSection: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#2c3e50',
  },
  messageContainer: {
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    lineHeight: 22,
  },
  textInput: {
    width: '100%',
    height: 100,
    borderWidth: 1,
    borderColor: '#e9ecef',
    borderRadius: 12,
    padding: 12,
    marginBottom: 15,
    textAlignVertical: 'top',
    backgroundColor: '#f8f9fa',
    fontSize: 16,
  },
  sendButton: {
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  primaryButton: {
    backgroundColor: '#4a90e2', // Changed to a more modern blue
  },
  secondaryButton: {
    backgroundColor: '#ff6b6b', // Changed to a softer red
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  socialSection: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  socialIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '18%',
    marginBottom: 10,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#f0f2f5',
  },
  modalAppsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    paddingHorizontal: 10,
  },
  modalAppIcon: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '33%',
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  modalIconBackground: {
    width: 60,
    height: 60,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default Community;
