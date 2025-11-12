import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Alert,
  StatusBar,
  Platform,
  PanResponder,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { requestAPI } from '../services/api';

const { width } = Dimensions.get('window');

const CreateRequestScreen = () => {
  const navigation = useNavigation();
  const [startingPoint, setStartingPoint] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [passengers, setPassengers] = useState(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!startingPoint || !destination) {
      Alert.alert('Error', 'Please fill starting point and destination');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        from: startingPoint,
        to: destination,
        date: selectedDate.toISOString().split('T')[0], // Format: YYYY-MM-DD
        time: selectedTime.toTimeString().split(' ')[0].substring(0, 5), // Format: HH:MM
        maxPersons: passengers,
        carType: 'Any', // Default car type
      };

      console.log('Submitting request:', requestData);
      
      const response = await requestAPI.createRequest(requestData);
      console.log('Request created successfully:', response.data);
      
      Alert.alert('Success', 'Request submitted successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Error creating request:', error);
      Alert.alert('Error', 'Failed to submit request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
  };

  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setSelectedTime(selectedTime);
    }
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const formatTime = (time) => {
    return time.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
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
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
              <Ionicons name="calendar-outline" size={20} color="#888" />
              <Text style={styles.dateTimeText}>
                {formatDate(selectedDate)}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.dateTimeGroup}>
            <Text style={styles.label}>Time</Text>
            <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
              <Ionicons name="time-outline" size={20} color="#888" />
              <Text style={styles.dateTimeText}>
                {formatTime(selectedTime)}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.passengersContainer}>
          <Text style={styles.label}>No. of Passengers</Text>
          <View style={styles.sliderContainer}>
            <TouchableOpacity 
              style={styles.passengerButton} 
              onPress={() => setPassengers(Math.max(1, passengers - 1))}
            >
              <Ionicons name="remove" size={20} color="#FFF" />
            </TouchableOpacity>
            
            <View style={styles.passengerDisplay}>
              <Text style={styles.currentPassengers}>{passengers}</Text>
              <Text style={styles.passengerLabel}>passenger{passengers !== 1 ? 's' : ''}</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.passengerButton} 
              onPress={() => setPassengers(Math.min(8, passengers + 1))}
            >
              <Ionicons name="add" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]} 
        onPress={handleSubmit}
        disabled={isSubmitting}
      >
        <Text style={styles.submitButtonText}>
          {isSubmitting ? 'Submitting...' : 'Submit Request'}
        </Text>
      </TouchableOpacity>

      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          minimumDate={new Date()}
        />
      )}

      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeChange}
        />
      )}

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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
    color: '#FFF',
    marginLeft: 10,
  },
  passengersContainer: {
    marginBottom: 40,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  passengerButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  passengerDisplay: {
    alignItems: 'center',
    minWidth: 100,
  },
  currentPassengers: {
    fontSize: 32,
    color: '#FFA500',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  passengerLabel: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: '#FFA500',
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: 'center',
    marginBottom: 100,
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
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
