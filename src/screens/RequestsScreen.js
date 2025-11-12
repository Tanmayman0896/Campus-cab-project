import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const RequestsScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

  const requests = [
    {
      id: 1,
      name: 'Salaj singh bisht',
      vehicle: 'Traveller',
      route: 'Route: MUJ - Delhi',
      date: 'Date: 01-11-2025',
      time: 'Time: 9:00 PM',
      mobile: 'Mobile: 9696969696',
    },
    {
      id: 2,
      name: 'Tanmay mandal',
      vehicle: 'Traveller',
      route: 'Route: MUJ - Delhi',
      date: 'Date: 01-11-2025',
      time: 'Time: 9:00 PM',
      mobile: 'Mobile: 9696969696',
    },
    {
      id: 3,
      name: 'Samaksh Gupta',
      vehicle: 'Traveller',
      route: 'Route: MUJ - Delhi',
      date: 'Date: 01-11-2025',
      time: 'Time: 9:00 PM',
      mobile: 'Mobile: 9696969696',
    },
    {
      id: 4,
      name: 'Neil Gupta',
      vehicle: 'Traveller',
      route: 'Route: MUJ - Delhi',
      date: 'Date: 01-11-2025',
      time: 'Time: 9:00 PM',
      mobile: 'Mobile: 9696969696',
    },
    {
      id: 5,
      name: 'blaa blaa',
      vehicle: 'Traveller',
      route: 'Route: MUJ - Delhi',
      date: 'Date: 01-11-2025',
      time: 'Time: 9:00 PM',
      mobile: 'Mobile: 9696969696',
    },
  ];

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleFilterPress = () => {
    navigation.navigate('Filter');
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateRequest');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Carpool Requests</Text>
          <Text style={styles.subtitle}>Connect with others to share rides.</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.requestsList} showsVerticalScrollIndicator={false}>
        {requests.map((request) => (
          <View key={request.id} style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>{request.name}</Text>
                <Text style={styles.requestVehicle}>{request.vehicle}</Text>
                <Text style={styles.requestRoute}>{request.route}</Text>
                <Text style={styles.requestDetails}>
                  {request.date}    {request.time}
                </Text>
                <Text style={styles.requestMobile}>{request.mobile}</Text>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.filterButton} onPress={handleFilterPress}>
          <Ionicons name="options" size={20} color="#FFF" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.createButton} onPress={handleCreateRequest}>
          <Ionicons name="add" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  requestsList: {
    flex: 1,
    marginBottom: 20,
    paddingBottom: 120,
  },
  requestCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
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
  requestInfo: {
    flex: 1,
  },
  requestName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  requestVehicle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  requestRoute: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  requestDetails: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  requestMobile: {
    fontSize: 14,
    color: '#888',
  },
  bottomActions: {
    position: 'absolute',
    bottom: 80,
    right: 20,
    flexDirection: 'column',
    alignItems: 'center',
  },
  filterButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  createButton: {
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

export default RequestsScreen;
