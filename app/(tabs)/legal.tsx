import { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, Image, Dimensions } from 'react-native';
import { Scale, Search, FileText, Users, BookOpen, MessageSquare, Phone, MapPin, TriangleAlert as AlertTriangle, ExternalLink } from 'lucide-react-native';

// Types for our data structures
interface LegalCategory {
  id: string;
  title: string;
  description: string;
  icon: any; // Lucide icon component type
  color: string;
}

interface LegalAidCenter {
  id: string;
  name: string;
  address: string;
  phone: string;
  services: string[];
  image: string;
}

interface DocumentTemplate {
  id: string;
  title: string;
  type: string;
  downloads: string;
  language: string;
}

interface RightsArticle {
  id: string;
  title: string;
  duration: string;
  image: string;
}

// Constants
const SCREEN_WIDTH = Dimensions.get('window').width;
const CARD_MARGIN = 20;
const CARD_WIDTH = SCREEN_WIDTH - (CARD_MARGIN * 2);

const LEGAL_CATEGORIES: LegalCategory[] = [
  {
    id: '1',
    title: 'Family Law',
    description: 'Marriage, Divorce, Child Custody',
    icon: Users,
    color: '#2196F3'
  },
  {
    id: '2',
    title: 'Property Law',
    description: 'Real Estate, Inheritance, Tenancy',
    icon: FileText,
    color: '#4CAF50'
  },
  {
    id: '3',
    title: 'Criminal Law',
    description: 'Legal Rights, Bail, Defense',
    icon: Scale,
    color: '#F44336'
  },
  {
    id: '4',
    title: 'Consumer Rights',
    description: 'Protection, Disputes, Claims',
    icon: AlertTriangle,
    color: '#FF9800'
  }
];

const LEGAL_AID_CENTERS: LegalAidCenter[] = [
  {
    id: '1',
    name: 'District Legal Services Authority',
    address: '15, Court Complex, Civil Lines, Delhi 110054',
    phone: '011-2345-6789',
    services: ['Free Legal Aid', 'Legal Counseling', 'Mediation Services'],
    image: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: '2',
    name: 'NALSA Legal Aid Center',
    address: '23, Bhagwan Das Road, New Delhi 110001',
    phone: '011-8765-4321',
    services: ['Pro Bono Services', 'Document Assistance', 'Legal Education'],
    image: 'https://images.unsplash.com/photo-1453945619913-79ec89a82c51?q=80&w=2940&auto=format&fit=crop'
  }
];

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    id: '1',
    title: 'Residential Lease Agreement',
    type: 'Property',
    downloads: '3.2K',
    language: 'English, Spanish'
  },
  {
    id: '2',
    title: 'Last Will and Testament',
    type: 'Estate',
    downloads: '2.8K',
    language: 'English, Spanish'
  },
  {
    id: '3',
    title: 'Consumer Complaint Form',
    type: 'Consumer',
    downloads: '4.1K',
    language: 'English, Spanish'
  }
];

const RIGHTS_AWARENESS: RightsArticle[] = [
  {
    id: '1',
    title: 'Understanding Your Legal Rights During Police Interactions',
    duration: '5 min read',
    image: 'https://images.unsplash.com/photo-1589578527966-fdac0f44566c?q=80&w=2940&auto=format&fit=crop'
  },
  {
    id: '2',
    title: "Complete Guide to Tenant Rights and Protections",
    duration: '8 min read',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2946&auto=format&fit=crop'
  }
];

export default function LegalWellbeingScreen() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Legal Resources</Text>
        <Text style={styles.subtitle}>Access free legal support and information</Text>
      </View>

      <ScrollView 
        style={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Search size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search legal resources..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#666"
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>Legal Categories</Text>
        <View style={styles.categoriesGrid}>
          {LEGAL_CATEGORIES.map(category => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              activeOpacity={0.7}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                <category.icon size={24} color="#fff" />
              </View>
              <Text style={styles.categoryTitle}>{category.title}</Text>
              <Text style={styles.categoryDesc}>{category.description}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Free Legal Aid Centers</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.aidCentersContainer}
          decelerationRate="fast"
          snapToInterval={CARD_WIDTH + 16}
        >
          {LEGAL_AID_CENTERS.map(center => (
            <TouchableOpacity 
              key={center.id} 
              style={styles.aidCard}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: center.image }} 
                style={styles.aidImage}
                resizeMode="cover"
              />
              <View style={styles.aidContent}>
                <Text style={styles.aidName}>{center.name}</Text>
                <View style={styles.aidMeta}>
                  <MapPin size={14} color="#666" />
                  <Text style={styles.aidAddress}>{center.address}</Text>
                </View>
                <View style={styles.aidServices}>
                  {center.services.map((service, index) => (
                    <View key={index} style={styles.serviceTag}>
                      <Text style={styles.serviceText}>{service}</Text>
                    </View>
                  ))}
                </View>
                <TouchableOpacity style={styles.callButton}>
                  <Phone size={14} color="#fff" />
                  <Text style={styles.callButtonText}>Contact Center</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Legal Document Templates</Text>
        <View style={styles.documentsContainer}>
          {DOCUMENT_TEMPLATES.map(doc => (
            <TouchableOpacity 
              key={doc.id} 
              style={styles.documentCard}
              activeOpacity={0.7}
            >
              <FileText size={24} color="#1976D2" />
              <View style={styles.documentInfo}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <Text style={styles.documentMeta}>
                  {doc.type} • {doc.downloads} downloads
                </Text>
                <Text style={styles.documentLang}>
                  Available in: {doc.language}
                </Text>
              </View>
              <ExternalLink size={20} color="#666" />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Know Your Rights</Text>
        <View style={styles.rightsContainer}>
          {RIGHTS_AWARENESS.map(article => (
            <TouchableOpacity 
              key={article.id} 
              style={styles.articleCard}
              activeOpacity={0.7}
            >
              <Image 
                source={{ uri: article.image }} 
                style={styles.articleImage}
                resizeMode="cover"
              />
              <View style={styles.articleContent}>
                <Text style={styles.articleTitle}>{article.title}</Text>
                <View style={styles.articleMeta}>
                  <BookOpen size={14} color="#666" />
                  <Text style={styles.articleDuration}>{article.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.helpSection}>
          <View style={styles.helpHeader}>
            <MessageSquare size={24} color="#E53935" />
            <Text style={styles.helpTitle}>Need Legal Help?</Text>
          </View>
          <Text style={styles.helpText}>
            Connect with pro bono lawyers and legal experts for free consultation
          </Text>
          <TouchableOpacity 
            style={styles.helpButton}
            activeOpacity={0.8}
          >
            <Text style={styles.helpButtonText}>Get Free Consultation</Text>
          </TouchableOpacity>
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
    backgroundColor: '#1976D2',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 20,
    paddingBottom: 0,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginHorizontal: 20,
    marginTop: 24,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    padding: 20,
    paddingTop: 0,
  },
  categoryCard: {
    width: '47%',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  categoryDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  aidCentersContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  aidCard: {
    width: CARD_WIDTH,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  aidImage: {
    width: '100%',
    height: 160,
  },
  aidContent: {
    padding: 16,
  },
  aidName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  aidMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  aidAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  aidServices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  serviceTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  serviceText: {
    fontSize: 12,
    color: '#666',
  },
  callButton: {
    backgroundColor: '#1976D2',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  callButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  documentsContainer: {
    padding: 20,
    paddingTop: 0,
    gap: 12,
  },
  documentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 16,
    marginRight: 8,
  },
  documentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  documentMeta: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  documentLang: {
    fontSize: 12,
    color: '#666',
  },
  rightsContainer: {
    padding: 20,
    paddingTop: 0,
    gap: 16,
  },
  articleCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  articleImage: {
    width: '100%',
    height: 200,
  },
  articleContent: {
    padding: 16,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    lineHeight: 22,
  },
  articleMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  articleDuration: {
    fontSize: 14,
    color: '#666',
  },
  helpSection: {
    margin: 20,
    backgroundColor: '#E3F2FD',
    padding: 20,
    borderRadius: 16,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976D2',
  },
  helpText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
    lineHeight: 20,
  },
  helpButton: {
    backgroundColor: '#1976D2',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  helpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});