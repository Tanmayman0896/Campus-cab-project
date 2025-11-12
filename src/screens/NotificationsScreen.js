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

const NotificationsScreen = () => {
  const navigation = useNavigation();

  const notifications = [
    {
      id: 1,
      type: 'accepted',
      title: 'Ride Request Accepted',
      message: 'Your ride request has been accepted by Tanmay',
      time: '2 hours ago',
      icon: 'car',
    },
    {
      id: 2,
      type: 'new_request',
      title: 'New Ride Request',
      message: 'Mahesh Jhangid\nMale, 2nd Year BTech CSE',
      time: '3 hours ago',
      icon: 'car',
      actions: true,
    },
    {
      id: 3,
      type: 'accepted',
      title: 'Ride Request Accepted',
      message: 'Your ride request has been accepted by Samaksh Gupta',
      time: '1 day ago',
      icon: 'car',
    },
    {
      id: 4,
      type: 'accepted',
      title: 'Ride Request Accepted',
      message: 'Your ride request has been accepted by Mahesh Jhangid',
      time: '2 days ago',
      icon: 'car',
    },
    {
      id: 5,
      type: 'new_request',
      title: 'New Ride Request',
      message: 'Salaj \nMale, 2nd Year BTech CSE',
      time: '3 days ago',
      icon: 'car',
      actions: true,
    },
  ];

  const handleBack = () => {
    navigation.goBack();
  };

  const handleAcceptRequest = (notificationId) => {
    console.log('Accept request:', notificationId);
  };

  const handleCallUser = (notificationId) => {
    console.log('Call user:', notificationId);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.title}>Notifications</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>Stay informed with the latest alerts.</Text>

      <ScrollView style={styles.notificationsList} showsVerticalScrollIndicator={false}>
        {notifications.map((notification) => (
          <View key={notification.id} style={styles.notificationCard}>
            <View style={styles.notificationHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name={notification.icon} size={20} color="#FFF" />
              </View>
              <View style={styles.notificationContent}>
                <Text style={styles.notificationTitle}>{notification.title}</Text>
                <Text style={styles.notificationMessage}>{notification.message}</Text>
                <Text style={styles.notificationTime}>{notification.time}</Text>
              </View>
            </View>
            
            {notification.actions && (
              <View style={styles.actionButtons}>
                <TouchableOpacity 
                  style={styles.acceptButton}
                  onPress={() => handleAcceptRequest(notification.id)}
                >
                  <Text style={styles.acceptButtonText}>Accept Request</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.callButton}
                  onPress={() => handleCallUser(notification.id)}
                >
                  <Ionicons name="call" size={16} color="#FFF" />
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      <TouchableOpacity style={styles.createButton}>
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
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 15,
  },
  acceptButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  acceptButtonText: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '500',
  },
  callButton: {
    backgroundColor: '#FFA500',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
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
