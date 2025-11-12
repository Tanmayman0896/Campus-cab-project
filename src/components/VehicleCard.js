import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const VehicleCard = ({ vehicle, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.info}>
        <Text style={styles.name}>{vehicle.name}</Text>
        <Text style={styles.description}>{vehicle.description}</Text>
        <Text style={styles.seats}>{vehicle.seats}</Text>
      </View>
      <View style={styles.iconContainer}>
        <Ionicons name={vehicle.icon} size={30} color="#FFA500" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  info: {
    flex: 1,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
    lineHeight: 20,
  },
  seats: {
    fontSize: 12,
    color: '#666',
  },
  iconContainer: {
    backgroundColor: '#333',
    borderRadius: 8,
    padding: 15,
    marginLeft: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: 80,
    height: 60,
  },
});

export default VehicleCard;
