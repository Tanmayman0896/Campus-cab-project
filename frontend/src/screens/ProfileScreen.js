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
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { userAPI } from '../services/api';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userInfo, setUserInfo] = useState({
    name: 'Loading...',
    registrationNo: '',
    email: '',
    course: '',
    branch: '',
    phone: '',
    createdAt: '',
  });
  const [userStats, setUserStats] = useState({
    totalRequests: 0,
    completedRides: 0,
    rating: 0,
  });
  const [loading, setLoading] = useState(true);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editForm, setEditForm] = useState({});

  // Fetch user profile when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      fetchUserProfile();
      fetchUserStats();
    }, [])
  );

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await userAPI.getProfile();
      console.log('User profile:', response.data);
      
      const userData = response.data.user || {};
      setUserInfo({
        name: userData.name || 'Campus Cab User',
        registrationNo: userData.registrationNo || 'N/A',
        email: userData.email || 'user@campus.edu',
        course: userData.course || 'BTech',
        branch: userData.branch || 'Computer Science Engineering',
        phone: userData.phone || 'Not provided',
        createdAt: userData.createdAt || new Date().toISOString(),
      });
      setEditForm(userData);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Keep default values if API fails
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const response = await userAPI.getUserStats();
      console.log('User stats:', response.data);
      setUserStats(response.data.stats || {
        totalRequests: 0,
        completedRides: 0,
        rating: 0,
      });
    } catch (error) {
      console.error('Error fetching user stats:', error);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const response = await userAPI.updateProfile(editForm);
      setUserInfo(prevInfo => ({ ...prevInfo, ...editForm }));
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    }
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
  };

  const handleCreateRequest = () => {
    navigation.navigate('CreateRequest');
  };

  const handleEditProfile = () => {
    setEditForm(userInfo);
    setEditModalVisible(true);
  };

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be available soon!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: () => {
            // Here you would clear user session/tokens
            Alert.alert('Logged Out', 'You have been logged out successfully.');
          }
        },
      ]
    );
  };

  const formatJoinDate = (dateString) => {
    const date = new Date(dateString);
    return `Member since ${date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long' 
    })}`;
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <TouchableOpacity onPress={handleNotificationPress}>
            <Ionicons name="notifications-outline" size={24} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.profileImageContainer}>
            <View style={styles.profileImage}>
              <Ionicons name="person" size={40} color="#FFF" />
            </View>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={16} color="#FFF" />
            </TouchableOpacity>
          </View>
          
          {loading ? (
            <Text style={styles.loadingText}>Loading profile...</Text>
          ) : (
            <>
              <Text style={styles.userName}>{userInfo.name}</Text>
              <Text style={styles.registrationNo}>
                Registration No: {userInfo.registrationNo}
              </Text>
              <Text style={styles.email}>{userInfo.email}</Text>
              <Text style={styles.joinDate}>
                {formatJoinDate(userInfo.createdAt)}
              </Text>
            </>
          )}
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <Text style={styles.sectionTitle}>Ride Statistics</Text>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.totalRequests}</Text>
              <Text style={styles.statLabel}>Total Requests</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.completedRides}</Text>
              <Text style={styles.statLabel}>Completed Rides</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{userStats.rating || 'N/A'}</Text>
              <Text style={styles.statLabel}>Rating</Text>
            </View>
          </View>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Course</Text>
            <Text style={styles.infoValue}>{userInfo.course}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Branch</Text>
            <Text style={styles.infoValue}>{userInfo.branch}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Phone</Text>
            <Text style={styles.infoValue}>{userInfo.phone}</Text>
          </View>
        </View>

        <View style={styles.actionSection}>
          <TouchableOpacity style={styles.actionButton} onPress={handleChangePassword}>
            <Text style={styles.actionButtonText}>Change Password</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
            <Text style={styles.actionButtonText}>Logout</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Made with ❤️ by IEEE CS MUJ
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.createButton} onPress={handleCreateRequest}>
        <Ionicons name="add" size={24} color="#FFF" />
      </TouchableOpacity>

      {/* Edit Profile Modal */}
      <Modal
        visible={editModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setEditModalVisible(false)}>
              <Ionicons name="close" size={24} color="#FFF" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleUpdateProfile}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={editForm.name || ''}
                onChangeText={(text) => setEditForm({...editForm, name: text})}
                placeholder="Enter your name"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={editForm.email || ''}
                onChangeText={(text) => setEditForm({...editForm, email: text})}
                placeholder="Enter your email"
                placeholderTextColor="#888"
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone</Text>
              <TextInput
                style={styles.input}
                value={editForm.phone || ''}
                onChangeText={(text) => setEditForm({...editForm, phone: text})}
                placeholder="Enter your phone number"
                placeholderTextColor="#888"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Course</Text>
              <TextInput
                style={styles.input}
                value={editForm.course || ''}
                onChangeText={(text) => setEditForm({...editForm, course: text})}
                placeholder="Enter your course"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Branch</Text>
              <TextInput
                style={styles.input}
                value={editForm.branch || ''}
                onChangeText={(text) => setEditForm({...editForm, branch: text})}
                placeholder="Enter your branch"
                placeholderTextColor="#888"
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFF',
  },
  loadingText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFA500',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
    textAlign: 'center',
  },
  registrationNo: {
    fontSize: 16,
    color: '#888',
    marginBottom: 5,
    textAlign: 'center',
  },
  email: {
    fontSize: 14,
    color: '#888',
    textAlign: 'center',
  },
  joinDate: {
    fontSize: 12,
    color: '#FFA500',
    textAlign: 'center',
    marginTop: 5,
  },
  statsSection: {
    marginBottom: 40,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingVertical: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFA500',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    textAlign: 'center',
  },
  infoSection: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 20,
  },
  infoItem: {
    marginBottom: 20,
  },
  infoLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  infoValue: {
    fontSize: 14,
    color: '#888',
  },
  actionSection: {
    marginBottom: 40,
  },
  actionButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  actionButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 100,
  },
  footerText: {
    fontSize: 14,
    color: '#888',
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
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
  },
  saveButton: {
    fontSize: 16,
    color: '#FFA500',
    fontWeight: 'bold',
  },
  modalContent: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    color: '#FFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: '#FFF',
  },
});

export default ProfileScreen;
