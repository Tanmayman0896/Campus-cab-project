import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { requestAPI } from '../services/api';

const MyRidesScreen = () => {
  const navigation = useNavigation();
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch user's requests when component mounts
  useEffect(() => {
    fetchUserRequests();
  }, []);

  const fetchUserRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getUserRequests();
      setUserRequests(response.data.requests || []);
      console.log('User requests fetched:', response.data);
    } catch (error) {
      console.error('Error fetching user requests:', error);
      setUserRequests([]);
    } finally {
      setLoading(false);
    }
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
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Rides</Text>
          <Text style={styles.route}>Your ride requests</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.requestsList} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading your rides...</Text>
          </View>
        ) : userRequests.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="car" size={50} color="#888" />
            <Text style={styles.emptyText}>No rides found</Text>
            <Text style={styles.emptySubText}>Create your first ride request!</Text>
          </View>
        ) : (
          userRequests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.routeInfo}>
                  <Text style={styles.routeText}>
                    {request.from} → {request.to}
                  </Text>
                  <Text style={styles.dateTime}>
                    {request.date} at {request.time}
                  </Text>
                  <Text style={styles.passengers}>
                    {request.maxPersons} passenger{request.maxPersons !== 1 ? 's' : ''}
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>Active</Text>
                </View>
              </View>
            </View>
          ))
        )}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  requestsList: {
    flex: 1,
    marginBottom: 20,
    paddingBottom: 120,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 18,
    color: '#888',
    textAlign: 'center',
  },
  emptyText: {
    fontSize: 20,
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    marginTop: 10,
    textAlign: 'center',
  },
  requestCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  routeInfo: {
    flex: 1,
  },
  routeText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 8,
  },
  dateTime: {
    fontSize: 14,
    color: '#FFA500',
    marginBottom: 5,
  },
  passengers: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    backgroundColor: '#00FF00',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    color: '#000',
    fontWeight: 'bold',
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
