import React, { useState } from 'react';
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

const FilterScreen = () => {
  const navigation = useNavigation();
  const [selectedFilters, setSelectedFilters] = useState({
    location: false,
    date: false,
    genderPreference: false,
  });

  const handleBack = () => {
    navigation.goBack();
  };

  const toggleFilter = (filterKey) => {
    setSelectedFilters(prev => ({
      ...prev,
      [filterKey]: !prev[filterKey]
    }));
  };

  const applyFilters = () => {
    // Apply filters and go back
    navigation.goBack();
  };

  const clearFilters = () => {
    setSelectedFilters({
      location: false,
      date: false,
      genderPreference: false,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="#FFA500" />
        </TouchableOpacity>
        <Text style={styles.title}>Filter By:</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.requestInfo}>
        <View style={styles.avatarContainer}>
          <Ionicons name="person" size={24} color="#FFF" />
        </View>
        <View style={styles.requestDetails}>
          <Text style={styles.requestName}>Samaksh Gupta</Text>
          <Text style={styles.requestVehicle}>Traveller</Text>
          <Text style={styles.requestRoute}>Route: MUJ - Delhi</Text>
        </View>
      </View>

      <ScrollView style={styles.filtersList} showsVerticalScrollIndicator={false}>
        <TouchableOpacity 
          style={[styles.filterButton, selectedFilters.location && styles.filterButtonActive]}
          onPress={() => toggleFilter('location')}
        >
          <Text style={[styles.filterButtonText, selectedFilters.location && styles.filterButtonTextActive]}>
            Location
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, selectedFilters.date && styles.filterButtonActive]}
          onPress={() => toggleFilter('date')}
        >
          <Text style={[styles.filterButtonText, selectedFilters.date && styles.filterButtonTextActive]}>
            Date
          </Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.filterButton, selectedFilters.genderPreference && styles.filterButtonActive]}
          onPress={() => toggleFilter('genderPreference')}
        >
          <Text style={[styles.filterButtonText, selectedFilters.genderPreference && styles.filterButtonTextActive]}>
            Gender Preference
          </Text>
        </TouchableOpacity>

        <View style={styles.remainingRequests}>
          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>Salaj Singh Bisht</Text>
                <Text style={styles.requestVehicle}>Traveller</Text>
                <Text style={styles.requestRoute}>Route: MUJ - Delhi</Text>
                <Text style={styles.requestDetails}>
                  Date: 01-11-2025    Time: 9:00 PM
                </Text>
                <Text style={styles.requestMobile}>Mobile: 9696969696</Text>
              </View>
            </View>
          </View>

          <View style={styles.requestCard}>
            <View style={styles.requestHeader}>
              <View style={styles.avatarContainer}>
                <Ionicons name="person" size={24} color="#FFF" />
              </View>
              <View style={styles.requestInfo}>
                <Text style={styles.requestName}>Tanmay</Text>
                <Text style={styles.requestVehicle}>Traveller</Text>
                <Text style={styles.requestRoute}>Route: MUJ - Delhi</Text>
                <Text style={styles.requestDetails}>
                  Date: 01-11-2025    Time: 9:00 PM
                </Text>
                <Text style={styles.requestMobile}>Mobile: 9696969696</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.clearButton} onPress={clearFilters}>
          <Text style={styles.clearButtonText}>Clear Filters</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.applyButton} onPress={applyFilters}>
          <Text style={styles.applyButtonText}>Apply Filters</Text>
        </TouchableOpacity>
      </View>

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
    marginBottom: 30,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFF',
  },
  requestInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 30,
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
  requestDetails: {
    flex: 1,
  },
  requestName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    marginBottom: 3,
  },
  requestVehicle: {
    fontSize: 14,
    color: '#888',
    marginBottom: 3,
  },
  requestRoute: {
    fontSize: 14,
    color: '#888',
  },
  filtersList: {
    flex: 1,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: '#FFA500',
  },
  filterButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#000',
  },
  remainingRequests: {
    marginTop: 30,
  },
  requestCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  requestInfo: {
    flex: 1,
  },
  requestDetails: {
    fontSize: 12,
    color: '#888',
    marginBottom: 3,
  },
  requestMobile: {
    fontSize: 12,
    color: '#888',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 100,
  },
  clearButton: {
    backgroundColor: '#333',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flex: 1,
    marginRight: 10,
    alignItems: 'center',
  },
  clearButtonText: {
    fontSize: 16,
    color: '#FFF',
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: '#FFA500',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 30,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
  },
  applyButtonText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
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

export default FilterScreen;
