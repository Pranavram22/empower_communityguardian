import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { BookOpen, TriangleAlert as AlertTriangle, TrendingUp, FileText } from 'lucide-react-native';

const COURSES = [
  {
    id: '1',
    title: 'Budgeting Basics',
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?q=80&w=2940&auto=format&fit=crop',
    duration: '2 hours',
    level: 'Beginner',
  },
  {
    id: '2',
    title: 'Investment 101',
    image: 'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?q=80&w=2940&auto=format&fit=crop',
    duration: '3 hours',
    level: 'Intermediate',
  },
];

export default function FinancialLiteracyScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Financial Literacy</Text>
        <Text style={styles.subtitle}>Learn to manage and protect your finances</Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.alertCard}>
          <AlertTriangle size={24} color="#E53935" />
          <View style={styles.alertContent}>
            <Text style={styles.alertTitle}>Scam Alert</Text>
            <Text style={styles.alertText}>
              New phone scam reported in your area. Stay vigilant!
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Learning Paths</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.coursesContainer}
        >
          {COURSES.map(course => (
            <TouchableOpacity key={course.id} style={styles.courseCard}>
              <Image
                source={{ uri: course.image }}
                style={styles.courseImage}
              />
              <View style={styles.courseInfo}>
                <Text style={styles.courseTitle}>{course.title}</Text>
                <View style={styles.courseMeta}>
                  <Text style={styles.courseMetaText}>{course.duration}</Text>
                  <Text style={styles.courseMetaText}>•</Text>
                  <Text style={styles.courseMetaText}>{course.level}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.sectionTitle}>Quick Tools</Text>
        <View style={styles.toolsGrid}>
          <TouchableOpacity style={styles.toolCard}>
            <FileText size={24} color="#1976D2" />
            <Text style={styles.toolTitle}>Document Scanner</Text>
            <Text style={styles.toolDesc}>Scan and verify financial documents</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.toolCard}>
            <TrendingUp size={24} color="#1976D2" />
            <Text style={styles.toolTitle}>Budget Tracker</Text>
            <Text style={styles.toolDesc}>Track your daily expenses</Text>
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
  content: {
    flex: 1,
    padding: 20,
  },
  alertCard: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
    gap: 16,
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E53935',
    marginBottom: 4,
  },
  alertText: {
    fontSize: 14,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  coursesContainer: {
    paddingBottom: 16,
    gap: 16,
  },
  courseCard: {
    width: 280,
    backgroundColor: '#fff',
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  courseImage: {
    width: '100%',
    height: 160,
  },
  courseInfo: {
    padding: 16,
  },
  courseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  courseMeta: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  courseMetaText: {
    fontSize: 14,
    color: '#666',
  },
  toolsGrid: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 8,
  },
  toolCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eee',
  },
  toolTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
    textAlign: 'center',
  },
  toolDesc: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});