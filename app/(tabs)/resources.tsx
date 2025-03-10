import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { MapPin, Search, Filter, Phone } from 'lucide-react-native';
import Map from '@/components/Map';

// Temporary mock data - would come from Firebase in production
const MOCK_RESOURCES = [
  {
    id: '1',
    name: 'Annapurna Food Bank',
    type: 'Food',
    address: '32, MG Road, Bengaluru 560001',
    phone: '080-2222-3333',
    image: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2940&auto=format&fit=crop',
    latitude: 12.9716,
    longitude: 77.5946,
  },
  {
    id: '2',
    name: 'Arogya Free Clinic',
    type: 'Healthcare',
    address: '45, Residency Road, Bengaluru 560025',
    phone: '080-4444-5555',
    image: 'https://images.unsplash.com/photo-1538108149393-fbbd81895907?q=80&w=2928&auto=format&fit=crop',
    latitude: 12.9719,
    longitude: 77.6014,
  },
];

export default function ResourcesScreen() {
  const [selectedResource, setSelectedResource] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [resources] = useState(MOCK_RESOURCES);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Find Resources</Text>
        <Text style={styles.subtitle}>Discover community support near you</Text>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBar}>
          <Search color="#666" size={20} />
          <Text style={styles.searchPlaceholder}>Search resources...</Text>
        </View>
        <TouchableOpacity style={styles.filterButton}>
          <Filter color="#E53935" size={20} />
        </TouchableOpacity>
      </View>

      <View style={styles.mapContainer}>
        <Map
          latitude={12.9716}
          longitude={77.5946}
        />
      </View>

      <ScrollView 
        style={styles.resourcesList}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.resourcesContent}
      >
        {resources.map((resource) => (
          <TouchableOpacity
            key={resource.id}
            style={styles.resourceCard}
            onPress={() => setSelectedResource(resource)}
          >
            <Image
              source={{ uri: resource.image }}
              style={styles.resourceImage}
            />
            <View style={styles.resourceInfo}>
              <Text style={styles.resourceName}>{resource.name}</Text>
              <View style={styles.resourceMeta}>
                <MapPin color="#666" size={14} />
                <Text style={styles.resourceAddress}>{resource.address}</Text>
              </View>
              <TouchableOpacity style={styles.callButton}>
                <Phone color="#fff" size={14} />
                <Text style={styles.callButtonText}>Call</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#E53935',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
    marginTop: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    padding: 20,
    gap: 12,
  },
  searchBar: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  searchPlaceholder: {
    color: '#666',
    flex: 1,
  },
  filterButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E53935',
  },
  mapContainer: {
    height: 200,
    margin: 20,
    marginTop: 0,
    borderRadius: 12,
    overflow: 'hidden',
  },
  resourcesList: {
    maxHeight: 280,
  },
  resourcesContent: {
    padding: 20,
    paddingRight: 0,
    gap: 16,
  },
  resourceCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  resourceImage: {
    width: '100%',
    height: 120,
  },
  resourceInfo: {
    padding: 16,
  },
  resourceName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resourceMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  resourceAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  callButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    borderRadius: 8,
    gap: 4,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
});