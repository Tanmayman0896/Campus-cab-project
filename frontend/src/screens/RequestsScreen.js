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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { requestAPI, voteAPI } from '../services/api';

const RequestsScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch requests when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchRequests();
    }, [])
  );

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await requestAPI.getAllRequests({
        search: searchText || undefined,
        limit: 20,
        page: 1
      });
      
      console.log('Fetched requests:', response.data);
      setRequests(response.data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Carpool Requests</Text>
          <Text style={styles.subtitle}>Connect with others to share rides.</Text>
        </View>
        <TouchableOpacity onPress={handleNotificationPress}>
          <Ionicons name="notifications-outline" size={24} color="#FFF" />
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
        {loading ? (
          <View style={styles.centerContent}>
            <Text style={styles.loadingText}>Loading requests...</Text>
          </View>
        ) : requests.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="car" size={50} color="#888" />
            <Text style={styles.emptyText}>No requests found</Text>
            <Text style={styles.emptySubText}>
              {searchText ? 'Try adjusting your search' : 'Be the first to create a request!'}
            </Text>
          </View>
        ) : (
          requests.map((request) => (
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
          ))
        )}
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
