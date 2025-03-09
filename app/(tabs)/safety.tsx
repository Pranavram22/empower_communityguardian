import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Image, Platform } from 'react-native';
import { Shield, Camera, Mic, TriangleAlert as AlertTriangle, MapPin, Clock, ChevronRight } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

export default function SafetyReportScreen() {
  const [reportType, setReportType] = useState<'urgent' | 'general' | null>(null);
  const [description, setDescription] = useState('');
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImagePickerAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const recentReports = [
    {
      id: '1',
      type: 'Unsafe Road Condition',
      location: 'Koramangala 5th Block, Bengaluru 560034',
      time: '2 hours ago',
      status: 'Under Review',
      statusColor: '#FFA000',
    },
    {
      id: '2',
      type: 'Street Light Down',
      location: 'HSR Layout Sector 2, Bengaluru 560102',
      time: '1 day ago',
      status: 'Resolved',
      statusColor: '#43A047',
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Safety Reporting</Text>
        <Text style={styles.subtitle}>Report incidents anonymously and securely</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.reportTypes}>
          <TouchableOpacity 
            style={[
              styles.reportTypeCard,
              reportType === 'urgent' && styles.selectedCard
            ]}
            onPress={() => setReportType('urgent')}
          >
            <View style={styles.urgentBadge}>
              <AlertTriangle size={32} color="#fff" />
            </View>
            <Text style={styles.reportTypeTitle}>Urgent Report</Text>
            <Text style={styles.reportTypeDesc}>Report immediate safety concerns</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.reportTypeCard,
              reportType === 'general' && styles.selectedCard
            ]}
            onPress={() => setReportType('general')}
          >
            <View style={[styles.urgentBadge, styles.generalBadge]}>
              <Shield size={32} color="#fff" />
            </View>
            <Text style={styles.reportTypeTitle}>General Safety</Text>
            <Text style={styles.reportTypeDesc}>Report non-urgent safety issues</Text>
          </TouchableOpacity>
        </View>

        {reportType && (
          <View style={styles.inputSection}>
            <Text style={styles.sectionTitle}>Report Details</Text>
            <TextInput
              style={styles.textArea}
              placeholder="Describe the incident in detail..."
              multiline
              numberOfLines={4}
              placeholderTextColor="#666"
              value={description}
              onChangeText={setDescription}
            />

            {image && (
              <View style={styles.imagePreview}>
                <Image source={{ uri: image }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeImage}
                  onPress={() => setImage(null)}
                >
                  <Text style={styles.removeImageText}>×</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.mediaButtons}>
              <TouchableOpacity style={styles.mediaButton} onPress={pickImage}>
                <Camera size={24} color="#E53935" />
                <Text style={styles.mediaButtonText}>Add Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.mediaButton}>
                <Mic size={24} color="#E53935" />
                <Text style={styles.mediaButtonText}>Voice Note</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity 
              style={[
                styles.submitButton,
                (!description && !image) && styles.submitButtonDisabled
              ]}
              disabled={!description && !image}
            >
              <Text style={styles.submitButtonText}>Submit Report</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.recentReports}>
          <Text style={styles.sectionTitle}>Recent Reports</Text>
          {recentReports.map(report => (
            <TouchableOpacity key={report.id} style={styles.reportCard}>
              <View style={styles.reportCardHeader}>
                <Text style={styles.reportCardTitle}>{report.type}</Text>
                <View style={[styles.statusBadge, { backgroundColor: report.statusColor }]}>
                  <Text style={styles.statusText}>{report.status}</Text>
                </View>
              </View>
              <View style={styles.reportCardDetails}>
                <View style={styles.reportCardDetail}>
                  <MapPin size={16} color="#666" />
                  <Text style={styles.reportCardDetailText}>{report.location}</Text>
                </View>
                <View style={styles.reportCardDetail}>
                  <Clock size={16} color="#666" />
                  <Text style={styles.reportCardDetailText}>{report.time}</Text>
                </View>
              </View>
              <ChevronRight size={20} color="#666" style={styles.reportCardArrow} />
            </TouchableOpacity>
          ))}
        </View>
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
  reportTypes: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 24,
  },
  reportTypeCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  selectedCard: {
    borderColor: '#E53935',
  },
  urgentBadge: {
    backgroundColor: '#E53935',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  generalBadge: {
    backgroundColor: '#1976D2',
  },
  reportTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  reportTypeDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  inputSection: {
    gap: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    minHeight: 120,
    textAlignVertical: 'top',
  },
  imagePreview: {
    position: 'relative',
    borderRadius: 12,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
  },
  removeImage: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeImageText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  mediaButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  mediaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderWidth: 1,
    borderColor: '#E53935',
    borderRadius: 12,
    gap: 8,
  },
  mediaButtonText: {
    color: '#E53935',
    fontSize: 14,
    fontWeight: '500',
  },
  submitButton: {
    backgroundColor: '#E53935',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 32,
  },
  submitButtonDisabled: {
    backgroundColor: '#ccc',
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  recentReports: {
    gap: 12,
  },
  reportCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  reportCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  reportCardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  reportCardDetails: {
    gap: 8,
  },
  reportCardDetail: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  reportCardDetailText: {
    color: '#666',
    fontSize: 14,
  },
  reportCardArrow: {
    position: 'absolute',
    right: 16,
    top: '50%',
    transform: [{ translateY: -10 }],
  },
});