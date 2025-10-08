import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const MyRidesScreen = () => {
  const navigation = useNavigation();

  const currentRide = {
    route: 'MUJ - WTP',
    seatsLeft: '2/4 Seats Left',
    passengers: [
      {
        id: 1,
        name: 'Mahesh jhangid',
        course: '2nd Year BTech CSE',
        gender: 'Male',
      },
      {
        id: 2,
        name: 'Samkash Gupta',
        course: '3rd Year BTech CSE',
        gender: 'Female',
      },
    ],
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateRequest');
  };

  const handleCall = (passenger) => {
    // Handle call functionality
    console.log('Calling:', passenger.name);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Ride</Text>
          <Text style={styles.route}>{currentRide.route}</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.seatsLeft}>{currentRide.seatsLeft}</Text>

      <ScrollView style={styles.passengersList} showsVerticalScrollIndicator={false}>
        {currentRide.passengers.map((passenger) => (
          <View key={passenger.id} style={styles.passengerCard}>
            <View style={styles.passengerHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.passengerInfo}>
                <Text style={styles.passengerName}>{passenger.name}</Text>
                <Text style={styles.passengerCourse}>{passenger.course}</Text>
                <Text style={styles.passengerGender}>{passenger.gender}</Text>
              </View>
              <TouchableOpacity 
                style={styles.callButton}
                onPress={() => handleCall(passenger)}
              >
                <Ionicons name="call" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateRequest}>
        <Ionicons name="add" size={24} color="#FFF" />
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
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  route: {
    fontSize: 16,
    color: '#888',
  },
  seatsLeft: {
    fontSize: 18,
    color: '#FFA500',
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  passengersList: {
    flex: 1,
    marginBottom: 20,
    paddingBottom: 120,
  },
  passengerCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  passengerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  passengerInfo: {
    flex: 1,
  },
  passengerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  passengerCourse: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  passengerGender: {
    fontSize: 14,
    color: '#888',
  },
  callButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButton: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

export default MyRidesScreen;
