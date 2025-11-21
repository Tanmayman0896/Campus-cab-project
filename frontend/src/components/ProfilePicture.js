import React, { useState, useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { userAPI } from '../services/api';

const ProfilePicture = ({ size = 40, borderWidth = 1 }) => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    fetchProfileImage();
  }, []);

  const fetchProfileImage = async () => {
    try {
      const response = await userAPI.getProfile();
      const userData = response.data?.data?.user || response.data?.user || response.data;
      
      if (userData?.profileImage) {
        setProfileImage(userData.profileImage);
      }
    } catch (error) {
      console.log('Failed to fetch profile image:', error);
    }
  };

  const getImageData = (imageData) => {
    if (!imageData) return null;
    
    if (imageData.startsWith('data:image/')) {
      return imageData;
    }
    
    if (imageData.startsWith('http')) {
      return imageData;
    }
    
    return `data:image/jpeg;base64,${imageData}`;
  };

  return (
    <View style={[
      styles.container, 
      { 
        width: size, 
        height: size, 
        borderRadius: size / 2,
        borderWidth: borderWidth 
      }
    ]}>
      {profileImage ? (
        <Image
          source={{ uri: getImageData(profileImage) }}
          style={[styles.image, { 
            width: size, 
            height: size, 
            borderRadius: size / 2 
          }]}
        />
      ) : (
        <Ionicons name="person" size={size * 0.5} color="#FFF" />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: '#FFA500',
  },
  image: {
    resizeMode: 'cover',
  },
});

export default ProfilePicture;