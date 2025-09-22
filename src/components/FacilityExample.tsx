import React from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { useFacility } from '../hooks/useFacility';

const FacilityExample: React.FC = () => {
  const { facilities, isLoading, error, refreshFacilities } = useFacility();

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading facilities...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <Text onPress={refreshFacilities} style={styles.retryText}>
          Tap to retry
        </Text>
      </View>
    );
  }

  const renderFacility = ({ item }: { item: any }) => (
    <View style={styles.facilityItem}>
      <Text style={styles.facilityTitle}>{item.title}</Text>
      {item.icon && <Text style={styles.facilityIcon}>{item.icon}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Facilities ({facilities.length})</Text>
      <FlatList
        data={facilities}
        renderItem={renderFacility}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        onRefresh={refreshFacilities}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  facilityItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  facilityTitle: {
    fontSize: 16,
    flex: 1,
  },
  facilityIcon: {
    fontSize: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
  },
  retryText: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default FacilityExample;
