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
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
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
  const [imageUploading, setImageUploading] = useState(false);

  // Fetch user profile when screen is focused
  useFocusEffect(
    React.useCallback(() => {
      console.log('📱 ProfileScreen focused - fetching latest data...');
      testBackendConnection();
      fetchUserProfile();
      fetchUserStats();
    }, [])
  );

  const testBackendConnection = async () => {
    try {
      console.log('🌐 Testing backend connection for ProfileScreen...');
      const result = await userAPI.testConnection?.() || { success: false };
      if (result.success) {
        console.log('✅ Backend connection successful for ProfileScreen');
      } else {
        console.log('❌ Backend connection failed for ProfileScreen');
      }
    } catch (error) {
      console.log('❌ ProfileScreen connection test error:', error.message);
    }
  };

  const fetchUserProfile = async () => {
    try {
      console.log('🔄 Fetching user profile...');
      setLoading(true);
      const response = await userAPI.getProfile();
      console.log('📱 User profile response:', response.data);
      
      // Backend returns user data directly in response.data
      const userData = response.data || {};
      console.log('👤 Processing user data:', userData);
      
      const profileData = {
        name: userData.name || 'Campus Cab User',
        registrationNo: userData.registrationNo || 'N/A',
        email: userData.email || 'user@campus.edu',
        course: userData.course || 'BTech',
        branch: userData.gender || 'Not specified',
        phone: userData.phone || 'Not provided',
        year: userData.year || 1,
        gender: userData.gender || 'Not specified',
        profileImage: userData.profileImage || null,
        createdAt: userData.createdAt || new Date().toISOString(),
      };
      
      console.log('✅ Setting profile data:', profileData);
      console.log('🖼️ Profile image from backend:', userData.profileImage);
      console.log('🖼️ Profile image constructed URL:', userData.profileImage ? getImageUrl(userData.profileImage) : 'No image');
      setUserInfo(profileData);
      setEditForm({
        name: userData.name,
        phone: userData.phone,
        course: userData.course,
        year: userData.year,
        gender: userData.gender
      });
    } catch (error) {
      console.error('❌ Error fetching user profile:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      // Set default values on error
      setUserInfo({
        name: 'Campus Cab User',
        registrationNo: 'N/A',
        email: 'user@campus.edu',
        course: 'BTech',
        branch: 'Computer Science Engineering',
        phone: 'Not provided',
        year: 1,
        gender: 'Not specified',
        createdAt: new Date().toISOString(),
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      console.log('🔄 Fetching user statistics...');
      
      // First test connection
      console.log('🌐 Testing connection before fetching stats...');
      const connectionResult = await userAPI.testConnection();
      if (!connectionResult.success) {
        throw new Error('Backend connection failed');
      }
      console.log('✅ Connection successful, proceeding with stats fetch...');
      
      const response = await userAPI.getUserStats();
      console.log('📊 Raw user stats response:', JSON.stringify(response, null, 2));
      console.log('📊 Response status:', response.status);
      console.log('📊 Response data type:', typeof response.data);
      
      // Backend returns: { success: true, data: { requests: { total, active, completed }, votes: { total, accepted, rejected } } }
      const stats = response.data;
      console.log('📈 Raw stats object:', stats);
      console.log('📈 Stats.requests:', stats.requests);
      console.log('📈 Stats.votes:', stats.votes);
      
      const userStatsData = {
        totalRequests: stats.requests?.total || 0,
        completedRides: stats.requests?.completed || 0,
        rating: 'N/A', // Rating system not implemented yet
        activeRequests: stats.requests?.active || 0,
        totalVotes: stats.votes?.total || 0,
        acceptedVotes: stats.votes?.accepted || 0,
        rejectedVotes: stats.votes?.rejected || 0,
      };
      
      console.log('📊 Final processed user stats:', userStatsData);
      console.log('🎯 Setting totalRequests to:', userStatsData.totalRequests);
      console.log('🎯 Setting completedRides to:', userStatsData.completedRides);
      
      setUserStats(userStatsData);
      console.log('✅ User stats updated successfully!');
    } catch (error) {
      console.error('❌ Error fetching user stats:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data
      });
      
      // Set default values on error but log it clearly
      console.log('⚠️ Setting default stats due to error');
      setUserStats({
        totalRequests: 0,
        completedRides: 0,
        rating: 'N/A',
        activeRequests: 0,
        totalVotes: 0,
        acceptedVotes: 0,
        rejectedVotes: 0,
      });
    }
  };

  const handleUpdateProfile = async () => {
    try {
      console.log('🔄 Updating profile with data:', editForm);
      
      // Validate required fields
      if (!editForm.name || editForm.name.trim().length < 2) {
        Alert.alert('Validation Error', 'Name must be at least 2 characters long.');
        return;
      }
      
      if (editForm.year && (editForm.year < 1 || editForm.year > 10)) {
        Alert.alert('Validation Error', 'Year must be between 1 and 10.');
        return;
      }
      
      const response = await userAPI.updateProfile(editForm);
      console.log('✅ Profile update response:', response.data);
      
      // Update local state with new data from backend
      const updatedUserData = response.data.data || response.data;
      setUserInfo(prevInfo => ({
        ...prevInfo,
        name: updatedUserData.name || editForm.name,
        phone: updatedUserData.phone || editForm.phone,
        course: updatedUserData.course || editForm.course,
        year: updatedUserData.year || editForm.year,
        gender: updatedUserData.gender || editForm.gender,
        branch: updatedUserData.gender || editForm.gender, // Using gender as branch for now
      }));
      
      setEditModalVisible(false);
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => fetchUserProfile() } // Refresh profile data
      ]);
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      console.error('❌ Update error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
      Alert.alert('Error', errorMessage);
    }
  };

  const handleNotificationPress = () => {
    navigation.navigate('Notifications');
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

  // Function to get full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) {
      console.log('🖼️ No image path provided');
      return null;
    }
    if (imagePath.startsWith('http')) {
      console.log('🖼️ Using full URL:', imagePath);
      return imagePath;
    }
    const fullUrl = `${userAPI.getApiBaseUrl()}${imagePath}`;
    console.log('🖼️ Constructed image URL:', fullUrl);
    console.log('🖼️ API Base URL:', userAPI.getApiBaseUrl());
    console.log('🖼️ Image Path:', imagePath);
    return fullUrl;
  };

  // Handle image picker
  const handleImagePicker = () => {
    Alert.alert(
      'Select Profile Picture',
      'Choose how you want to select your profile picture',
      [
        { text: 'Camera', onPress: () => pickImage('camera') },
        { text: 'Photo Library', onPress: () => pickImage('library') },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  // Pick image from camera or library
  const pickImage = async (source) => {
    try {
      const { status } = source === 'camera' 
        ? await ImagePicker.requestCameraPermissionsAsync()
        : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert('Permission Required', `Please grant ${source} permission to upload profile picture.`);
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
          });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        await uploadProfileImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('❌ Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  // Upload profile image
  const uploadProfileImage = async (imageUri) => {
    try {
      setImageUploading(true);
      console.log('📤 Uploading profile image:', imageUri);
      
      const response = await userAPI.uploadProfileImage(imageUri);
      console.log('✅ Image upload response:', response.data);
      
      // Extract the image URL from the response
      const imageUrl = response.data.data?.imageUrl || response.data.imageUrl || response.data.data?.user?.profileImage;
      console.log('🖼️ Extracted image URL:', imageUrl);
      
      // Update local state with new profile image
      setUserInfo(prev => ({
        ...prev,
        profileImage: imageUrl
      }));
      
      Alert.alert('Success', 'Profile picture updated successfully!');
    } catch (error) {
      console.error('❌ Error uploading image:', error);
      const errorMessage = error.response?.data?.message || 'Failed to upload image. Please try again.';
      Alert.alert('Error', errorMessage);
    } finally {
      setImageUploading(false);
    }
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
            <TouchableOpacity 
              style={styles.profileImage} 
              onPress={handleImagePicker}
              disabled={imageUploading}
            >
              {userInfo.profileImage ? (
                <Image 
                  source={{ 
                    uri: getImageUrl(userInfo.profileImage)
                  }} 
                  style={styles.profileImagePhoto}
                  onError={(e) => {
                    console.log('❌ Failed to load profile image:', userInfo.profileImage);
                    console.log('❌ Constructed URL:', getImageUrl(userInfo.profileImage));
                    console.log('❌ Error details:', e.nativeEvent?.error);
                  }}
                />
              ) : (
                <Ionicons name="person" size={40} color="#FFF" />
              )}
              {imageUploading && (
                <View style={styles.uploadingOverlay}>
                  <Ionicons name="cloud-upload" size={20} color="#FFA500" />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={styles.editButton} onPress={handleEditProfile}>
              <Ionicons name="create-outline" size={16} color="#FFF" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.cameraButton} onPress={handleImagePicker} disabled={imageUploading}>
              <Ionicons name="camera" size={16} color="#FFF" />
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

        {/* Stats Section - Temporarily commented out */}
        {/*
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
        */}

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Course</Text>
            <Text style={styles.infoValue}>{userInfo.course}</Text>
          </View>
          
          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Academic Year</Text>
            <Text style={styles.infoValue}>{userInfo.year ? `Year ${userInfo.year}` : 'Not specified'}</Text>
          </View>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>Gender</Text>
            <Text style={styles.infoValue}>{userInfo.gender}</Text>
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
                placeholder="Enter your course (e.g., BTech)"
                placeholderTextColor="#888"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Academic Year</Text>
              <TextInput
                style={styles.input}
                value={editForm.year ? editForm.year.toString() : ''}
                onChangeText={(text) => setEditForm({...editForm, year: parseInt(text) || 1})}
                placeholder="Enter your academic year (1-10)"
                placeholderTextColor="#888"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Gender</Text>
              <TextInput
                style={styles.input}
                value={editForm.gender || ''}
                onChangeText={(text) => setEditForm({...editForm, gender: text})}
                placeholder="Enter your gender"
                placeholderTextColor="#888"
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
  profileImagePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  uploadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraButton: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFA500',
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
