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
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { voteAPI, requestAPI } from '../services/api';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch notifications when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchNotifications();
    }, [])
  );

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      
      // Fetch votes on user's requests (these become notifications)
      const votesResponse = await voteAPI.getUserVotes({ limit: 20 });
      const votes = votesResponse.data.votes || [];
      
      // Transform votes into notifications
      const voteNotifications = votes.map(vote => ({
        id: `vote_${vote.id}`,
        type: vote.status === 'accepted' ? 'accepted' : 'rejected',
        title: vote.status === 'accepted' ? 'Ride Request Accepted' : 'Ride Request Declined',
        message: `${vote.voter?.name || 'Someone'} has ${vote.status} your ride request from ${vote.request?.from} to ${vote.request?.to}`,
        time: getRelativeTime(vote.createdAt),
        icon: vote.status === 'accepted' ? 'checkmark-circle' : 'close-circle',
        vote: vote,
        color: vote.status === 'accepted' ? '#4CAF50' : '#F44336',
      }));

      setNotifications(voteNotifications);
      console.log('Notifications loaded:', voteNotifications.length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const getRelativeTime = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString();
  };

  const handleBack = () => {
    navigation.goBack();
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateRequest');
  };

  const handleCallUser = (phoneNumber) => {
    if (phoneNumber) {
      const phoneUrl = `tel:${phoneNumber}`;
      Linking.canOpenURL(phoneUrl).then(supported => {
        if (supported) {
          Linking.openURL(phoneUrl);
        } else {
          Alert.alert('Error', 'Unable to make phone call');
        }
      });
    } else {
      Alert.alert('No Phone Number', 'Phone number not available for this user.');
    }
  };

  const handleViewRequest = (requestId) => {
    // Navigate to request details or show more info
    Alert.alert('Request Details', `Request ID: ${requestId}\n\nThis will show full request details in a future update.`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>Stay informed with the latest alerts.</Text>

      <ScrollView 
        style={styles.notificationsList} 
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
            <Text style={styles.loadingText}>Loading notifications...</Text>
          </View>
        ) : notifications.length === 0 ? (
          <View style={styles.centerContent}>
            <Ionicons name="notifications" size={50} color="#888" />
            <Text style={styles.emptyText}>No notifications yet</Text>
            <Text style={styles.emptySubText}>
              You'll see responses to your ride requests here
            </Text>
          </View>
        ) : (
          notifications.map((notification) => (
            <TouchableOpacity 
              key={notification.id} 
              style={styles.notificationCard}
              onPress={() => handleViewRequest(notification.vote?.requestId)}
            >
              <View style={styles.notificationHeader}>
                <View style={[styles.iconContainer, { backgroundColor: notification.color }]}>
                  <Ionicons name={notification.icon} size={20} color="#FFF" />
                </View>
                <View style={styles.notificationContent}>
                  <Text style={styles.notificationTitle}>{notification.title}</Text>
                  <Text style={styles.notificationMessage}>{notification.message}</Text>
                  <Text style={styles.notificationTime}>{notification.time}</Text>
                  {notification.vote?.note && (
                    <Text style={styles.noteText}>Note: {notification.vote.note}</Text>
                  )}
                </View>
              </View>
              
              {notification.vote?.voter?.phone && notification.type === 'accepted' && (
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.callButton}
                    onPress={() => handleCallUser(notification.vote.voter.phone)}
                  >
                    <Ionicons name="call" size={16} color="#FFF" />
                    <Text style={styles.callButtonText}>Call</Text>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
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
    marginBottom: 30,
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
    paddingHorizontal: 40,
  },
  notificationsList: {
    flex: 1,
    marginBottom: 100,
  },
  notificationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  notificationHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  notificationMessage: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
    lineHeight: 20,
  },
  notificationTime: {
    fontSize: 12,
    color: '#666',
  },
  noteText: {
    fontSize: 12,
    color: '#FFA500',
    fontStyle: 'italic',
    marginTop: 5,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
    justifyContent: 'flex-end',
  },
  callButton: {
    backgroundColor: '#FFA500',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 5,
  },
  callButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  createButton: {
    position: 'absolute',
    bottom: 100,
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

export default NotificationsScreen;
