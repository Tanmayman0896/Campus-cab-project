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

const HomeScreen = () => {
  const navigation = useNavigation();

  const vehicleOptions = [
    {
      id: 1,
      name: 'Auto',
      description: 'Compact and efficient for solo rides.',
      seats: '1-3 seats',
      icon: 'taxi',
    },
    {
      id: 2,
      name: 'Sedan',
      description: 'Comfortable and reliable for small groups.',
      seats: '2-4 seats',
      icon: 'car',
    },
    {
      id: 3,
      name: 'SUV',
      description: 'Spacious for larger groups or extra luggage.',
      seats: '4-6 seats',
      icon: 'car-sport',
    },
    {
      id: 4,
      name: 'Traveller',
      description: 'Ideal for long trips with ample space.',
      seats: '7-10 seats',
      icon: 'bus',
    },
  ];

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateRequest');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, Tanmay.</Text>
          <Text style={styles.subText}>How would you like to go today?</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Select any mode of transport</Text>

      <ScrollView style={styles.vehicleList} showsVerticalScrollIndicator={false}>
        {vehicleOptions.map((vehicle) => (
          <TouchableOpacity key={vehicle.id} style={styles.vehicleCard}>
            <View style={styles.vehicleInfo}>
              <Text style={styles.vehicleName}>{vehicle.name}</Text>
              <Text style={styles.vehicleDescription}>{vehicle.description}</Text>
              <Text style={styles.vehicleSeats}>{vehicle.seats}</Text>
            </View>
            <View style={styles.vehicleImageContainer}>
              <Ionicons name={vehicle.icon} size={30} color="#FFA500" />
            </View>
          </TouchableOpacity>
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
    marginBottom: 30,
  },
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subText: {
    fontSize: 16,
    color: '#888',
  },
  sectionTitle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 20,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  vehicleList: {
    flex: 1,
    paddingBottom: 120,
  },
  vehicleCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  vehicleInfo: {
    flex: 1,
  },
  vehicleName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  vehicleDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    lineHeight: 20,
  },
  vehicleSeats: {
    fontSize: 12,
    color: '#666',
  },
  vehicleImageContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 60,
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

export default HomeScreen;
