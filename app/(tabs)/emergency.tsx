import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Platform, Modal, TextInput } from 'react-native';
import * as Location from 'expo-location';
import { Bell, Phone, MessageCircle, Shield, Car, Power, X, Heart, Activity, Plus, UserPlus, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Map from '@/components/Map';
import { useAccidentDetection } from '@/hooks/useAccidentDetection';

const EMERGENCY_SERVICES = [
  { id: '1', name: 'Police', number: '100', icon: Shield, color: '#1E88E5' },
  { id: '2', name: 'Medical', number: '108', icon: Heart, color: '#E53935' },
  { id: '3', name: 'Fire', number: '101', icon: Bell, color: '#FB8C00' },
  { id: '4', name: 'Roadside', number: '1800-120-1438', icon: Car, color: '#43A047' },
];

export default function EmergencyScreen() {
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newContact, setNewContact] = useState({ name: '', number: '', relationship: '' });
  const [vitalStats, setVitalStats] = useState({
    heartRate: '75',
    bloodPressure: '120/80',
    lastUpdated: new Date().toLocaleTimeString(),
  });
  const [contacts, setContacts] = useState([
    { id: '1', name: 'mom', number: '+91 98765 43210', relationship: 'Family', lastChecked: '2 hours ago' },
    { id: '2', name: 'dad', number: '+91 98765 43211', relationship: 'Family', lastChecked: '2 hours ago' },
  ]);

  const handleAccidentDetected = async (location: { latitude: number; longitude: number }) => {
    setLocation(location);
    Alert.alert(
      'Emergency Alert',
      'A severe impact has been detected. Emergency services will be contacted if you do not respond.',
      [{ text: 'I\'m OK', style: 'cancel' }, { text: 'Get Help', style: 'destructive' }]
    );
  };

  const {
    isMonitoring,
    countdownActive,
    countdown,
    startMonitoring,
    stopMonitoring,
    cancelCountdown,
  } = useAccidentDetection(handleAccidentDetected);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();

    // Simulate vital stats updates
    const interval = setInterval(() => {
      setVitalStats(prev => ({
        heartRate: (70 + Math.floor(Math.random() * 10)).toString(),
        bloodPressure: `${115 + Math.floor(Math.random() * 10)}/${75 + Math.floor(Math.random() * 10)}`,
        lastUpdated: new Date().toLocaleTimeString(),
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const triggerSOS = async () => {
    if (!location) {
      Alert.alert('Error', 'Unable to get your location. Please try again.');
      return;
    }

    setIsLoading(true);

    Alert.alert(
      'Emergency Alert',
      'This will send your location and vital stats to emergency contacts. Continue?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => setIsLoading(false),
        },
        {
          text: 'Send Alert',
          style: 'destructive',
          onPress: async () => {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setIsLoading(false);
            Alert.alert(
              'Alert Sent',
              'Emergency contacts have been notified with your location and vital stats.',
              [{ text: 'OK' }]
            );
          },
        },
      ]
    );
  };

  const addContact = () => {
    if (!newContact.name || !newContact.number) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    setContacts(prev => [
      ...prev,
      {
        id: Date.now().toString(),
        ...newContact,
        lastChecked: 'Just added',
      },
    ]);
    setNewContact({ name: '', number: '', relationship: '' });
    setShowAddContact(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Emergency SOS</Text>
        <Text style={styles.subtitle}>24/7 Emergency Assistance</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.vitalsCard}>
          <View style={styles.vitalsHeader}>
            <Activity size={24} color="#E53935" />
            <Text style={styles.vitalsTitle}>Real-time Vitals</Text>
          </View>
          <View style={styles.vitalsGrid}>
            <View style={styles.vitalItem}>
              <Heart size={20} color="#E53935" />
              <Text style={styles.vitalValue}>{vitalStats.heartRate}</Text>
              <Text style={styles.vitalLabel}>BPM</Text>
            </View>
            <View style={styles.vitalItem}>
              <Activity size={20} color="#1E88E5" />
              <Text style={styles.vitalValue}>{vitalStats.bloodPressure}</Text>
              <Text style={styles.vitalLabel}>Blood Pressure</Text>
            </View>
          </View>
          <Text style={styles.lastUpdated}>Last updated: {vitalStats.lastUpdated}</Text>
        </View>

        <View style={styles.monitoringSection}>
          <View style={styles.monitoringHeader}>
            <Car size={24} color="#E53935" />
            <Text style={styles.monitoringTitle}>Accident Detection</Text>
          </View>
          <Text style={styles.monitoringDesc}>
            Using advanced sensors to detect impacts and automatically alert emergency services
          </Text>
          <TouchableOpacity
            style={[styles.monitoringButton, isMonitoring && styles.monitoringButtonActive]}
            onPress={isMonitoring ? stopMonitoring : startMonitoring}
          >
            <Power size={20} color={isMonitoring ? '#fff' : '#E53935'} />
            <Text style={[styles.monitoringButtonText, isMonitoring && styles.monitoringButtonTextActive]}>
              {isMonitoring ? 'Monitoring Active' : 'Start Monitoring'}
            </Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={[styles.sosButton, isLoading && styles.sosButtonLoading]} 
          onPress={triggerSOS}
          disabled={isLoading}
        >
          <View style={styles.sosButtonInner}>
            <AlertTriangle color="#fff" size={32} />
            <Text style={styles.sosText}>
              {isLoading ? 'SENDING ALERT...' : 'TRIGGER EMERGENCY SOS'}
            </Text>
          </View>
          <Text style={styles.sosSubtext}>
            Instantly alert emergency services and trusted contacts
          </Text>
        </TouchableOpacity>

        <View style={styles.mapContainer}>
          {location ? (
            <Map
              latitude={location.latitude}
              longitude={location.longitude}
            />
          ) : (
            <View style={styles.loadingMap}>
              <Text>{errorMsg || 'Loading map...'}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emergency Services</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.servicesContainer}
          >
            {EMERGENCY_SERVICES.map(service => (
              <TouchableOpacity
                key={service.id}
                style={[styles.serviceCard, { borderColor: service.color }]}
                onPress={() => {
                  Alert.alert(
                    'Call Emergency Service',
                    `Are you sure you want to call ${service.name}?`,
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Call', style: 'destructive' },
                    ]
                  );
                }}
              >
                <View style={[styles.serviceIcon, { backgroundColor: service.color }]}>
                  <service.icon size={24} color="#fff" />
                </View>
                <Text style={styles.serviceName}>{service.name}</Text>
                <Text style={styles.serviceNumber}>{service.number}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Emergency Contacts</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => setShowAddContact(true)}
            >
              <UserPlus size={20} color="#E53935" />
              <Text style={styles.addButtonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.contactsList}>
            {contacts.map(contact => (
              <View key={contact.id} style={styles.contactCard}>
                <View style={styles.contactInfo}>
                  <Text style={styles.contactName}>{contact.name}</Text>
                  <Text style={styles.contactRelation}>{contact.relationship}</Text>
                  <Text style={styles.contactLastChecked}>Last check-in: {contact.lastChecked}</Text>
                </View>
                <View style={styles.contactActions}>
                  <TouchableOpacity style={styles.contactAction}>
                    <MessageCircle size={20} color="#E53935" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.contactAction}>
                    <Phone size={20} color="#E53935" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={countdownActive}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={cancelCountdown}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Accident Detected</Text>
            <Text style={styles.modalCountdown}>{countdown}</Text>
            <Text style={styles.modalDesc}>
              Emergency services will be contacted in {countdown} seconds.
              Tap to cancel if you're OK.
            </Text>
            <TouchableOpacity 
              style={styles.modalCancelButton}
              onPress={cancelCountdown}
            >
              <Text style={styles.modalCancelText}>I'm OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={showAddContact}
        transparent
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity 
              style={styles.modalCloseButton}
              onPress={() => setShowAddContact(false)}
            >
              <X size={24} color="#666" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Add Emergency Contact</Text>
            
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={newContact.name}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, name: text }))}
                placeholder="Contact name"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={newContact.number}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, number: text }))}
                placeholder="Phone number"
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Relationship</Text>
              <TextInput
                style={styles.input}
                value={newContact.relationship}
                onChangeText={(text) => setNewContact(prev => ({ ...prev, relationship: text }))}
                placeholder="e.g., Family, Friend, Doctor"
              />
            </View>

            <TouchableOpacity 
              style={styles.addContactButton}
              onPress={addContact}
            >
              <Plus size={20} color="#fff" />
              <Text style={styles.addContactButtonText}>Add Contact</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingTop: Platform.OS === 'web' ? 20 : 60,
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
  content: {
    flex: 1,
    padding: 20,
  },
  vitalsCard: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  vitalsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  vitalsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  vitalsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  vitalItem: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  vitalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 8,
  },
  vitalLabel: {
    fontSize: 12,
    color: '#666',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  monitoringSection: {
    backgroundColor: '#FFF5F5',
    padding: 20,
    borderRadius: 16,
    marginBottom: 20,
  },
  monitoringHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  monitoringTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#E53935',
  },
  monitoringDesc: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  monitoringButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  monitoringButtonActive: {
    backgroundColor: '#E53935',
  },
  monitoringButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#E53935',
  },
  monitoringButtonTextActive: {
    color: '#fff',
  },
  sosButton: {
    backgroundColor: '#E53935',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    elevation: 4,
    shadowColor: '#E53935',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  sosButtonLoading: {
    backgroundColor: '#EF5350',
  },
  sosButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 8,
  },
  sosText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sosSubtext: {
    color: '#fff',
    opacity: 0.8,
    textAlign: 'center',
    fontSize: 14,
  },
  mapContainer: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
  },
  loadingMap: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  servicesContainer: {
    paddingRight: 20,
    gap: 16,
  },
  serviceCard: {
    width: 140,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  serviceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  serviceNumber: {
    fontSize: 12,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E53935',
  },
  addButtonText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '500',
  },
  contactsList: {
    gap: 12,
  },
  contactCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactRelation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  contactLastChecked: {
    fontSize: 12,
    color: '#999',
  },
  contactActions: {
    flexDirection: 'row',
    gap: 12,
  },
  contactAction: {
    padding: 8,
    backgroundColor: '#FFF5F5',
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    padding: 8,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 24,
    textAlign: 'center',
  },
  modalCountdown: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  modalCancelButton: {
    backgroundColor: '#E53935',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addContactButton: {
    backgroundColor: '#E53935',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  addContactButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});