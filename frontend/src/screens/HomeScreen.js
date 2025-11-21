import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  StatusBar,
  Platform,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { testConnection, requestAPI, userAPI } from '../services/api';

const HomeScreen = () => {
  const navigation = useNavigation();
  const [connectionStatus, setConnectionStatus] = useState('testing');
  const [requests, setRequests] = useState([]);
  const [profileImage, setProfileImage] = useState(null);

  const fetchProfileImage = async () => {
    try {
      console.log('🔍 Attempting to fetch profile image...');
      const response = await userAPI.getProfile();
      console.log('📡 Profile API Response:', response.data);
      
      // The profileImage is directly in response.data.data.profileImage based on the logs
      const profileImageData = response.data?.data?.profileImage || 
                              response.data?.data?.user?.profileImage || 
                              response.data?.user?.profileImage ||
                              response.data?.profileImage;
      
      console.log('🖼️ Profile Image exists:', !!profileImageData);
      console.log('🖼️ Profile Image type:', typeof profileImageData);
      console.log('🖼️ Profile Image preview:', profileImageData?.substring(0, 100));
      
      if (profileImageData) {
        setProfileImage(profileImageData);
        console.log('✅ Profile image state set successfully');
      } else {
        console.log('❌ No profile image found in response');
      }
    } catch (error) {
      console.log('❌ Failed to fetch profile image:', error.message);
      console.log('❌ Error details:', error.response?.data);
    }
  };

  const getImageData = (imageData) => {
    if (!imageData) return null;
    if (imageData.startsWith('data:image/')) return imageData;
    if (imageData.startsWith('http')) return imageData;
    return `data:image/jpeg;base64,${imageData}`;
  };

  // Test backend connection when component mounts
  useEffect(() => {
    const checkConnection = async () => {
      try {
        console.log('🔄 Testing backend connection...');
        const isConnected = await testConnection();
        setConnectionStatus(isConnected ? 'connected' : 'disconnected');
        
        if (isConnected) {
          // Try to fetch some requests to test API
          try {
            const response = await requestAPI.getAllRequests();
            setRequests(response.data || []);
            console.log('✅ Successfully fetched requests:', response.data?.length || 0);
          } catch (error) {
            console.log('ℹ️ No requests available or endpoint not ready');
          }
        }
      } catch (error) {
        console.error('❌ Connection test failed:', error);
        setConnectionStatus('disconnected');
      }
    };

    checkConnection();
  }, []);

  // Fetch profile image when connection is established
  useEffect(() => {
    if (connectionStatus === 'connected') {
      fetchProfileImage();
    }
  }, [connectionStatus]);

  // Test effect to see if we can display an image
  useEffect(() => {
    console.log('🔄 Profile image state changed:', !!profileImage);
    if (profileImage) {
      console.log('✅ ProfileImage exists, type:', typeof profileImage);
      console.log('🖼️ First 50 chars:', profileImage.substring(0, 50));
    }
  }, [profileImage]);

  const vehicleOptions = [
    {
      id: 1,
      name: 'Auto',
      description: 'Compact and efficient for solo rides.',
      seats: '1-3 seats',
      icon: 'auto',
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

  const handleProfilePress = () => {
    navigation.navigate('Profile');
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hey, Tanmay.</Text>
          <Text style={styles.subText}>How would you like to go today?</Text>
          {/* Connection status indicator */}
          <View style={styles.connectionStatus}>
            <View style={[styles.statusDot, 
              connectionStatus === 'connected' ? styles.connected : 
              connectionStatus === 'disconnected' ? styles.disconnected : 
              styles.testing
            ]} />
            <Text style={styles.statusText}>
              {connectionStatus === 'connected' ? '🟢 Backend Connected' :
               connectionStatus === 'disconnected' ? '🔴 Backend Offline' :
               '🟡 Connecting...'}
            </Text>
          </View>
        </View>
        <TouchableOpacity 
          onPress={handleProfilePress} 
          onLongPress={() => {
            // Test function: Long press to set a test image
            console.log('🧪 Setting test profile image...');
            setProfileImage('data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=');
          }}
          style={styles.profileButton}
        >
          <View style={styles.profilePicContainer}>
            {profileImage ? (
              <Image
                source={{ uri: getImageData(profileImage) }}
                style={styles.profileImage}
                onLoad={() => console.log('✅ Profile image loaded in UI')}
                onError={(e) => console.log('❌ Profile image load error:', e.nativeEvent.error)}
              />
            ) : (
              <Ionicons name="person" size={26} color="#FFF" />
            )}
          </View>
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
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  connected: {
    backgroundColor: '#4CAF50',
  },
  disconnected: {
    backgroundColor: '#F44336',
  },
  testing: {
    backgroundColor: '#FFA500',
  },
  statusText: {
    fontSize: 12,
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
});

export default HomeScreen;
