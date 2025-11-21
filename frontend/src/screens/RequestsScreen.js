import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  TextInput,
  StatusBar,
  Platform,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { requestAPI, voteAPI, userAPI } from '../services/api';

const RequestsScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [requests, setRequests] = useState([]);
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
    console.log('📍 RequestsScreen state changed:');
    console.log('  - requests.length:', requests.length);
    console.log('  - loading:', loading);
    console.log('  - requests:', requests);
  }, [requests, loading]);

  // Fetch requests when screen is focused or search text changes
  useFocusEffect(
    React.useCallback(() => {
      fetchRequests();
      // Fetch profile image separately, non-blocking
      setTimeout(() => fetchProfileImage(), 1000);
    }, [searchText])
  );

  const fetchRequests = async () => {
    try {
      console.log('🔄 Starting to fetch requests...');
      setLoading(true);
      
      // Add network connectivity test
      console.log('🌐 Testing connectivity to backend...');
      await requestAPI.testConnection();
      
      const response = await requestAPI.getAllRequests({
        search: searchText || undefined,
        limit: 20,
        page: 1
      });
      
      console.log('📡 Raw API Response:', JSON.stringify(response, null, 2));
      console.log('📊 Response Data Structure:');
      console.log('  - response type:', typeof response);
      console.log('  - response.data type:', typeof response.data);
      console.log('  - response.data:', JSON.stringify(response.data, null, 2));
      
      // The API returns: { success: true, data: { requests: [...], pagination: {...} } }
      // Axios puts this in response.data, so we need response.data.data.requests
      const apiData = response.data?.data;
      console.log('  - apiData:', apiData);
      console.log('  - apiData.requests type:', typeof apiData?.requests);
      console.log('  - apiData.requests:', apiData?.requests);
      
      if (apiData && Array.isArray(apiData.requests)) {
        console.log('  - requests array length:', apiData.requests.length);
        apiData.requests.forEach((req, index) => {
          console.log(`  - Request ${index}:`, {
            id: req.id,
            from: req.from,
            to: req.to,
            date: req.date,
            userId: req.userId
          });
        });
      }
      
      // Extract requests array from the correct nested structure
      const requests = apiData?.requests || [];
      console.log('🎯 Final requests to display:', requests);
      console.log('📏 Number of requests:', Array.isArray(requests) ? requests.length : 'not an array');
      
      if (Array.isArray(requests)) {
        console.log('✅ Setting requests state with', requests.length, 'items');
        setRequests(requests);
      } else {
        console.log('❌ Requests is not an array, setting empty array');
        setRequests([]);
      }
    } catch (error) {
      console.error('❌ Error fetching requests:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      setRequests([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchRequests();
  };

  const handleSearch = () => {
    fetchRequests();
  };

  const handleVoteOnRequest = async (requestId, status) => {
    try {
      const response = await voteAPI.voteOnRequest(requestId, {
        status: status, // 'accepted' or 'rejected'
        note: status === 'accepted' ? 'I would like to join this ride' : 'Cannot join this ride'
      });
      
      Alert.alert(
        'Success', 
        `You have ${status} the ride request!`,
        [{ text: 'OK', onPress: () => fetchRequests() }]
      );
    } catch (error) {
      console.error('Error voting on request:', error);
      Alert.alert('Error', 'Failed to respond to request. Please try again.');
    }
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

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  const handleFilterPress = () => {
    navigation.navigate('Filter');
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateRequest');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Carpool Requests</Text>
          <Text style={styles.subtitle}>Connect with others to share rides.</Text>
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

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by destination..."
          placeholderTextColor="#888"
          value={searchText}
          onChangeText={setSearchText}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
          <Ionicons name="search" size={20} color="#FFF" />
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
        {(() => {
          console.log('🎨 RENDERING - Current state:');
          console.log('  - loading:', loading);
          console.log('  - requests.length:', requests.length);
          console.log('  - requests array:', requests);
          
          if (loading) {
            console.log('🔄 Rendering loading state');
            return (
              <View style={styles.centerContent}>
                <Text style={styles.loadingText}>Loading requests...</Text>
              </View>
            );
          } else if (requests.length === 0) {
            console.log('📭 Rendering empty state');
            return (
              <View style={styles.centerContent}>
                <Ionicons name="car" size={50} color="#888" />
                <Text style={styles.emptyText}>No requests found</Text>
                <Text style={styles.emptySubText}>
                  {searchText ? 'Try adjusting your search' : 'Be the first to create a request!'}
                </Text>
              </View>
            );
          } else {
            console.log('📋 Rendering', requests.length, 'requests');
            return requests.map((request) => (
            <View key={request.id} style={styles.requestCard}>
              <View style={styles.requestHeader}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person" size={24} color="#FFF" />
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestName}>
                    {request.user?.name || 'Anonymous User'}
                  </Text>
                  <Text style={styles.requestVehicle}>{request.carType}</Text>
                  <Text style={styles.requestRoute}>
                    {request.from} → {request.to}
                  </Text>
                  <Text style={styles.requestDetails}>
                    {formatDate(request.date)} at {formatTime(request.time)}
                  </Text>
                  <Text style={styles.requestSeats}>
                    {request.currentOccupancy}/{request.maxPersons} seats occupied
                  </Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusText}>{request.status}</Text>
                </View>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleVoteOnRequest(request.id, 'accepted')}
                >
                  <Ionicons name="checkmark" size={16} color="#FFF" />
                  <Text style={styles.actionButtonText}>Accept</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.rejectButton}
                  onPress={() => handleVoteOnRequest(request.id, 'rejected')}
                >
                  <Ionicons name="close" size={16} color="#FFF" />
                  <Text style={styles.actionButtonText}>Pass</Text>
                </TouchableOpacity>
              </View>
            </View>
          ));
          }
        })()}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
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
  profileButton: {
    marginLeft: 10,
  },
  profilePicContainer: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFA500',
    overflow: 'hidden',
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#FFF',
    paddingVertical: 15,
  },
  searchButton: {
    padding: 8,
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
    color: '#FFA500',
    marginBottom: 5,
  },
  requestSeats: {
    fontSize: 14,
    color: '#888',
  },
  statusBadge: {
    backgroundColor: '#00FF00',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    color: '#000',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 15,
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  rejectButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F44336',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 5,
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
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
