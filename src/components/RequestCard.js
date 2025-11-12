import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const RequestCard = ({ request, onPress, showActions = false, onAccept, onCall }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={24} color="#FFF" />
        </View>
        <View style={styles.info}>
          <Text style={styles.name}>{request.name}</Text>
          <Text style={styles.vehicle}>{request.vehicle}</Text>
          <Text style={styles.route}>{request.route}</Text>
          <Text style={styles.details}>
            {request.date}    {request.time}
          </Text>
          <Text style={styles.mobile}>{request.mobile}</Text>
        </View>
      </View>
      
      {showActions && (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.acceptButton} onPress={onAccept}>
            <Text style={styles.acceptText}>Accept Request</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.callButton} onPress={onCall}>
            <Ionicons name="call" size={16} color="#FFF" />
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
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
  vehicle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  route: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  details: {
    fontSize: 14,
    color: '#888',
    marginBottom: 5,
  },
  mobile: {
    fontSize: 14,
    color: '#888',
  },
  actions: {
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
  acceptText: {
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
});

export default RequestCard;
