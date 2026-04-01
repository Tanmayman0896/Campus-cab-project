import React, { useEffect, useMemo, useState } from 'react';
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
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { requestAPI } from '../services/api';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const DEFAULT_REGION = {
  latitude: 26.8432,
  longitude: 75.5669,
  latitudeDelta: 0.008,
  longitudeDelta: 0.008,
};

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
  const [isResolvingAddress, setIsResolvingAddress] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [searchMode, setSearchMode] = useState('pickup');

  const [region, setRegion] = useState(DEFAULT_REGION);
  const [markerCoordinate, setMarkerCoordinate] = useState({
    latitude: DEFAULT_REGION.latitude,
    longitude: DEFAULT_REGION.longitude,
  });

  useEffect(() => {
    loadCurrentLocation();
  }, []);

  useEffect(() => {
    const query = (searchMode === 'pickup' ? startingPoint : destination).trim();

    if (query.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      await searchPlaces(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [startingPoint, destination, searchMode]);

  const canSubmit = useMemo(() => {
    return Boolean(
      pickupConfirmed &&
        selectedPickup &&
        selectedDestination &&
        selectedDate &&
        selectedTime
    );
  }, [pickupConfirmed, selectedPickup, selectedDestination, selectedDate, selectedTime]);

  const loadCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Location Permission', 'Please allow location permission to auto-detect your pickup.');
        return;
      }

      const current = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const lat = current.coords.latitude;
      const lng = current.coords.longitude;

      const nextRegion = {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.008,
        longitudeDelta: 0.008,
      };

      setRegion(nextRegion);
      setMarkerCoordinate({ latitude: lat, longitude: lng });
      await resolveAddress(lat, lng, false);
    } catch (error) {
      console.log('Failed to load current location:', error.message);
    }
  };

  const resolveAddress = async (lat, lng, showError = true) => {
    try {
      setIsResolvingAddress(true);
      const response = await requestAPI.reverseGeocode({ lat, lng });
      const address = response.data?.data?.address;

      if (!address) return;

      if (searchMode === 'pickup') {
        setStartingPoint(address);
        setSelectedPickup({
          address,
          lat,
          lng,
        });
      } else {
        setDestination(address);
        setSelectedDestination({
          address,
          lat,
          lng,
        });
      }
    } catch (error) {
      if (showError) {
        Alert.alert('Location Error', 'Unable to fetch address for this location.');
      }
    } finally {
      setIsResolvingAddress(false);
    }
  };

  const searchPlaces = async (query) => {
    try {
      setIsSearching(true);
      const response = await requestAPI.searchPlaces({
        input: query,
        lat: markerCoordinate.latitude,
        lng: markerCoordinate.longitude,
      });

      setSearchResults(response.data?.data?.places || []);
    } catch (error) {
      console.log('Place search failed:', error.message);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectPlace = (place) => {
    const lat = Number(place.location?.lat);
    const lng = Number(place.location?.lng);

    if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    const nextRegion = {
      latitude: lat,
      longitude: lng,
      latitudeDelta: 0.008,
      longitudeDelta: 0.008,
    };

    setRegion(nextRegion);
    setMarkerCoordinate({ latitude: lat, longitude: lng });
    setSearchResults([]);

    if (searchMode === 'pickup') {
      setStartingPoint(place.description || place.title);
      setSelectedPickup({
        address: place.description || place.title,
        lat,
        lng,
      });
    } else {
      setDestination(place.description || place.title);
      setSelectedDestination({
        address: place.description || place.title,
        lat,
        lng,
      });
    }
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleSubmit = async () => {
    if (!canSubmit) {
      Alert.alert('Error', 'Please confirm pickup, destination, date and time before creating request.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const requestData = {
        from: selectedPickup.address,
        to: selectedDestination.address,
        pickupAddress: selectedPickup.address,
        pickupLat: selectedPickup.lat,
        pickupLng: selectedPickup.lng,
        destinationAddress: selectedDestination.address,
        destinationLat: selectedDestination.lat,
        destinationLng: selectedDestination.lng,
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
        <Text style={styles.title}>Pick-up</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          region={region}
          onRegionChangeComplete={(nextRegion) => {
            setRegion(nextRegion);
            setMarkerCoordinate({
              latitude: nextRegion.latitude,
              longitude: nextRegion.longitude,
            });
          }}
          onPress={(event) => {
            const lat = event.nativeEvent.coordinate.latitude;
            const lng = event.nativeEvent.coordinate.longitude;
            setMarkerCoordinate({ latitude: lat, longitude: lng });
            setRegion({
              latitude: lat,
              longitude: lng,
              latitudeDelta: region.latitudeDelta,
              longitudeDelta: region.longitudeDelta,
            });
            resolveAddress(lat, lng, false);
          }}
        >
          <Marker coordinate={markerCoordinate} pinColor="#7ED957" />
        </MapView>

        <View style={styles.searchOverlay}>
          <Ionicons name="location" size={20} color="#7ED957" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={searchMode === 'pickup' ? 'Pick-up location' : 'Destination'}
            placeholderTextColor="#7A7A7A"
            value={searchMode === 'pickup' ? startingPoint : destination}
            onChangeText={(text) => {
              if (searchMode === 'pickup') {
                setStartingPoint(text);
                setSelectedPickup(null);
                setPickupConfirmed(false);
              } else {
                setDestination(text);
                setSelectedDestination(null);
              }
            }}
          />
          {!!(searchMode === 'pickup' ? startingPoint : destination) && (
            <TouchableOpacity
              onPress={() => {
                if (searchMode === 'pickup') {
                  setStartingPoint('');
                  setSelectedPickup(null);
                  setPickupConfirmed(false);
                } else {
                  setDestination('');
                  setSelectedDestination(null);
                }
                setSearchResults([]);
              }}
            >
              <Ionicons name="close" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {isSearching && (
          <View style={styles.searchLoadingPill}>
            <ActivityIndicator color="#FFA500" size="small" />
          </View>
        )}

        {searchResults.length > 0 && (
          <View style={styles.resultsPanel}>
            <FlatList
              data={searchResults}
              keyExtractor={(item, index) => `${item.placeId}-${index}`}
              keyboardShouldPersistTaps="handled"
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.resultItem} onPress={() => handleSelectPlace(item)}>
                  <Ionicons name="location-outline" size={18} color="#FFA500" />
                  <View style={styles.resultTextWrap}>
                    <Text style={styles.resultTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={styles.resultSubtitle} numberOfLines={1}>{item.subtitle || item.description}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        )}

        {!pickupConfirmed && (
          <View style={styles.confirmWrap}>
            <TouchableOpacity
              style={styles.confirmButton}
              onPress={async () => {
                await resolveAddress(markerCoordinate.latitude, markerCoordinate.longitude, true);
                if (!selectedPickup && !startingPoint) {
                  return;
                }
                setPickupConfirmed(true);
                setSearchMode('destination');
              }}
              disabled={isResolvingAddress}
            >
              {isResolvingAddress ? (
                <ActivityIndicator color="#FFF" size="small" />
              ) : (
                <Text style={styles.confirmButtonText}>Confirm Location</Text>
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>

      {pickupConfirmed && (
        <View style={styles.formCard}>
          <Text style={styles.cardTitle}>Ride Details</Text>

          <View style={styles.readonlyRow}>
            <Ionicons name="navigate" size={16} color="#7ED957" />
            <Text style={styles.readonlyText} numberOfLines={2}>{selectedPickup?.address || startingPoint}</Text>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={20} color="#FFA500" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Add destination"
              placeholderTextColor="#888"
              value={destination}
              onFocus={() => setSearchMode('destination')}
              onChangeText={(text) => {
                setDestination(text);
                setSelectedDestination(null);
              }}
            />
          </View>

          <View style={styles.dateTimeContainer}>
            <View style={styles.dateTimeGroup}>
              <Text style={styles.label}>Date</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowDatePicker(true)}>
                <Ionicons name="calendar-outline" size={18} color="#9C9C9C" />
                <Text style={styles.dateTimeText}>{formatDate(selectedDate)}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.dateTimeGroup}>
              <Text style={styles.label}>Time</Text>
              <TouchableOpacity style={styles.dateTimeButton} onPress={() => setShowTimePicker(true)}>
                <Ionicons name="time-outline" size={18} color="#9C9C9C" />
                <Text style={styles.dateTimeText}>{formatTime(selectedTime)}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.passengersContainer}>
            <Text style={styles.label}>Passengers</Text>
            <View style={styles.sliderContainer}>
              <TouchableOpacity
                style={styles.passengerButton}
                onPress={() => setPassengers(Math.max(1, passengers - 1))}
              >
                <Ionicons name="remove" size={18} color="#FFF" />
              </TouchableOpacity>
              <Text style={styles.currentPassengers}>{passengers}</Text>
              <TouchableOpacity
                style={styles.passengerButton}
                onPress={() => setPassengers(Math.min(8, passengers + 1))}
              >
                <Ionicons name="add" size={18} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.submitButton, (!canSubmit || isSubmitting) && styles.submitButtonDisabled]}
            onPress={handleSubmit}
            disabled={!canSubmit || isSubmitting}
          >
            <Text style={styles.submitButtonText}>{isSubmitting ? 'Creating...' : 'Create Request'}</Text>
          </TouchableOpacity>
        </View>
      )}

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
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 14,
    marginBottom: 14,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#FFF',
    marginLeft: 16,
  },
  headerPlaceholder: {
    width: 24,
    height: 24,
    marginLeft: 'auto',
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: 12,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: '#101010',
    borderWidth: 1,
    borderColor: '#2B2B2B',
  },
  map: {
    flex: 1,
  },
  searchOverlay: {
    position: 'absolute',
    top: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    minHeight: 54,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 18,
    color: '#181818',
    paddingVertical: 10,
  },
  searchLoadingPill: {
    position: 'absolute',
    top: 74,
    right: 16,
    backgroundColor: '#1C1C1C',
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#303030',
  },
  resultsPanel: {
    position: 'absolute',
    top: 74,
    left: 12,
    right: 12,
    maxHeight: 220,
    backgroundColor: '#111111',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222222',
  },
  resultTextWrap: {
    flex: 1,
  },
  resultTitle: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  resultSubtitle: {
    color: '#9A9A9A',
    fontSize: 12,
    marginTop: 2,
  },
  confirmWrap: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
  },
  confirmButton: {
    backgroundColor: '#111111',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#242424',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: '#111111',
    marginHorizontal: 12,
    borderRadius: 16,
    marginTop: 12,
    marginBottom: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#252525',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 10,
  },
  readonlyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#1A1A1A',
    borderWidth: 1,
    borderColor: '#262626',
  },
  readonlyText: {
    flex: 1,
    color: '#DCDCDC',
    fontSize: 13,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    marginBottom: 10,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#FFF',
  },
  dateTimeContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  dateTimeGroup: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: '#FFF',
    marginBottom: 6,
  },
  dateTimeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#2A2A2A',
  },
  dateTimeText: {
    fontSize: 13,
    color: '#FFF',
    marginLeft: 6,
  },
  passengersContainer: {
    marginBottom: 10,
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#1A1A1A',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#2A2A2A',
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  passengerButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentPassengers: {
    fontSize: 18,
    color: '#FFF',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#FFA500',
    borderRadius: 10,
    paddingVertical: 13,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#666',
  },
  submitButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default CreateRequestScreen;
