import { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedView } from './ThemedView';

export default function LocationSearch({ onSubmit, initialLocation }: { onSubmit: (location: string) => void, initialLocation: string }) {
  const [location, setLocation] = useState(initialLocation || '');

  const handleSubmit = () => {
    if (location.trim()) {
      onSubmit(location.trim());
    }
  };

  return (
    <ThemedView style={styles.container}>
      <TextInput
        style={styles.input}
        value={location}
        onChangeText={setLocation}
        placeholder="Search for a city..."
        placeholderTextColor="#888"
        returnKeyType="search"
        onSubmitEditing={handleSubmit}
      />
      <TouchableOpacity onPress={handleSubmit} style={styles.searchButton}>
        <Ionicons name="search" size={24} color="#555" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    color: '#333',
  },
  searchButton: {
    padding: 8,
  },
}); 