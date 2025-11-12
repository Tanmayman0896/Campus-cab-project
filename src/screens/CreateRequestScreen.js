import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const CreateRequestScreen = () => {
  const navigation = useNavigation();
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [passengers, setPassengers] = useState(4);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = () => {
    if (!startingPoint || !destination || !selectedDate || !selectedTime) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }
    
    Alert.alert('Success', 'Request submitted successfully!');
    navigation.goBack();
  };

  const handleDateSelect = () => {
    // This would typically open a date picker
    setSelectedDate('01-11-2025');
  };

  const handleTimeSelect = () => {
    // This would typically open a time picker
    setSelectedTime('9:00 PM');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Create a Request</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.subtitle}>Enter your trip info to find a match.</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#FFA500" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Starting Point"
              placeholderTextColor="#888"
              value={startingPoint}
              onChangeText={setStartingPoint}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="location" size={20} color="#FFA500" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Destination"
              placeholderTextColor="#888"
              value={destination}
              onChangeText={setDestination}
            />
          </View>
        </View>

        <View style={styles.dateTimeContainer}>
          <View style={styles.dateTimeGroup}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={handleDateSelect}>
              <Ionicons name="calendar-outline" size={20} color="#888" />
              <Text style={styles.dateTimeText}>
                {selectedDate || 'Select Date'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeGroup}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={handleTimeSelect}>
              <Ionicons name="time-outline" size={20} color="#888" />
              <Text style={styles.dateTimeText}>
                {selectedTime || 'Select Time'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.passengersContainer}>
          <Text style={styles.label}>No. of Passengers</Text>
          <View style={styles.sliderContainer}>
            <Text style={styles.sliderValue}>0</Text>
            <View style={styles.sliderTrack}>
              <View style={[styles.sliderFill, { width: `${(passengers / 10) * 100}%` }]} />
              <TouchableOpacity 
                style={[styles.sliderThumb, { left: `${(passengers / 10) * 100}%` }]}
                onPress={() => setPassengers(passengers < 10 ? passengers + 1 : 0)}
              />
            </View>
            <Text style={styles.sliderValue}>10</Text>
          </View>
          <Text style={styles.currentPassengers}>{passengers}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit Request</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.closeButton} onPress={handleBack}>
        <Ionicons name="close" size={24} color="#FFF" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingHorizontal: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginBottom: 40,
  },
  form: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
    marginBottom: 15,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  dateTimeGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  label: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 10,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  dateTimeText: {
    fontSize: 16,
    color: '#888',
    marginLeft: 10,
  },
  passengersContainer: {
    marginBottom: 40,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    marginHorizontal: 10,
    position: 'relative',
  },
  sliderFill: {
    height: 4,
    backgroundColor: '#FFA500',
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    top: -8,
    width: 20,
    height: 20,
    backgroundColor: '#FFA500',
    borderRadius: 10,
    marginLeft: -10,
  },
  sliderValue: {
    fontSize: 16,
    color: '#888',
    width: 20,
    textAlign: 'center',
  },
  currentPassengers: {
    fontSize: 24,
    color: '#FFA500',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#FFA500',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 100,
  },
  submitButtonText: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  closeButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CreateRequestScreen;
