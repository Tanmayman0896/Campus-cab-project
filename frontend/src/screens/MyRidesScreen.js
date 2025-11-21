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
  RefreshControl,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { requestAPI, userAPI } from '../services/api';

const MyRidesScreen = () => {
  const navigation = useNavigation();
  const [userRequests, setUserRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  const fetchProfileImage = async () => {
    try {
      const response = await userAPI.getProfile();
      
      // The profileImage is directly in response.data.data.profileImage
      const profileImageData = response.data?.data?.profileImage || 
                              response.data?.data?.user?.profileImage || 
                              response.data?.user?.profileImage ||
                              response.data?.profileImage;
      
      if (profileImageData) {
        setProfileImage(profileImageData);
        console.log('✅ Profile image loaded successfully');
      } else {
        console.log('❌ No profile image found in response');
      }
    } catch (error) {
      console.log('❌ Failed to fetch profile image:', error.message);
    }
  };

  const getImageData = (imageData) => {
    if (!imageData) return null;
    if (imageData.startsWith('data:image/')) return imageData;
    if (imageData.startsWith('http')) return imageData;
    return `data:image/jpeg;base64,${imageData}`;
  };

  // Debug state changes
  useEffect(() => {
    console.log('📍 MyRidesScreen state changed:');
    console.log('  - userRequests.length:', userRequests.length);
    console.log('  - loading:', loading);
    console.log('  - userRequests:', userRequests);
  }, [userRequests, loading]);

  // Fetch user's requests when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchUserRequests();
      // Fetch profile image separately, non-blocking
      setTimeout(() => fetchProfileImage(), 1000);
    }, [])
  );

  const fetchUserRequests = async () => {
    try {
      console.log('🔄 Starting to fetch user requests...');
      setLoading(true);
      
      // Test connectivity
      console.log('🌐 Testing connectivity for user requests...');
      await requestAPI.testConnection();
      
      const response = await requestAPI.getUserRequests();
      
      console.log('📡 Raw User API Response:', JSON.stringify(response, null, 2));
      console.log('📊 User Response Data Structure:');
      console.log('  - response type:', typeof response);
      console.log('  - response.data type:', typeof response.data);
      console.log('  - response.data:', JSON.stringify(response.data, null, 2));
      
      // The API returns: { success: true, data: { requests: [...] } }
      // Axios puts this in response.data, so we need response.data.data.requests
      const apiData = response.data?.data;
      console.log('  - apiData:', apiData);
      console.log('  - apiData.requests type:', typeof apiData?.requests);
      console.log('  - apiData.requests:', apiData?.requests);
      
      if (apiData && Array.isArray(apiData.requests)) {
        console.log('  - user requests array length:', apiData.requests.length);
        apiData.requests.forEach((req, index) => {
          console.log(`  - User Request ${index}:`, {
            id: req.id,
            from: req.from,
            to: req.to,
            date: req.date,
            userId: req.userId,
            status: req.status
          });
        });
      }
      
      // Extract requests array from the correct nested structure
      const requests = apiData?.requests || [];
      console.log('🎯 Final user requests to display:', requests);
      console.log('📈 Number of user requests:', Array.isArray(requests) ? requests.length : 'not an array');
      
      if (Array.isArray(requests)) {
        console.log('✅ Setting user requests state with', requests.length, 'items');
        setUserRequests(requests);
      } else {
        console.log('❌ User requests is not an array, setting empty array');
        setUserRequests([]);
      }
    } catch (error) {
      console.error('❌ Error fetching user requests:', error);
      console.error('❌ User requests error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      setUserRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchUserRequests();
  };

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleCall = (passenger) => {
    // Handle call functionality
    console.log('Calling:', passenger.name);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY format
  };

  const formatTime = (timeString) => {
    const [hours, minutes] = timeString.split(':');
    const date = new Date();
    date.setHours(hours, minutes);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Rides</Text>
          <Text style={styles.route}>Your ride requests</Text>
        </View>
        <TouchableOpacity onPress={handleProfilePress} style={styles.profileButton}>
          <View style={styles.profilePicContainer}>
            {profileImage ? (
              <Image
                source={{ uri: getImageData(profileImage) }}
                style={styles.profileImage}
              />
            ) : (
              <Ionicons name="person" size={26} color="#FFF" />
            )}
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView 
        style={styles.requestsList} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#FFA500"
          />
        }
      >
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
                    {formatDate(request.date)} at {formatTime(request.time)}
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
  profileButton: {
    marginLeft: 10,
  },
  profilePicContainer: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
    overflow: 'hidden',
  },
  profileImage: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
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
});

export default MyRidesScreen;
