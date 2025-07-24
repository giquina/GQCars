import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import SecurityAssessmentService from '../services/SecurityAssessmentService';

const AssessmentScreen = ({ navigation, route }) => {

  // Get selected service from route params
  const { service } = route.params || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "What is your primary security transport requirement?",
      options: [
        { value: "executive", label: "Executive/VIP Protection Services", risk: 4 },
        { value: "diplomatic", label: "Diplomatic/Government Transport", risk: 5 },
        { value: "corporate", label: "Corporate Travel Security", risk: 3 },
        { value: "personal", label: "Personal Safety & Discretion", risk: 2 },
      ]
    },
    {
      id: 2,
      question: "Have you experienced any security incidents or received threats?",
      options: [
        { value: "none", label: "No known threats or incidents", risk: 1 },
        { value: "suspicious", label: "Suspicious activity or surveillance", risk: 3 },
        { value: "verbal", label: "Verbal threats or harassment", risk: 4 },
        { value: "physical", label: "Physical threats or attempted incidents", risk: 5 },
      ]
    },
    {
      id: 3,
      question: "What best describes your current threat assessment level?",
      options: [
        { value: "minimal", label: "Minimal risk - General precaution", risk: 1 },
        { value: "moderate", label: "Moderate risk - Business executive", risk: 3 },
        { value: "elevated", label: "Elevated risk - Public figure", risk: 4 },
        { value: "high", label: "High risk - Specific threats known", risk: 5 },
      ]
    },
    {
      id: 4,
      question: "What types of locations do you typically travel to?",
      options: [
        { value: "secure", label: "Secure facilities & private venues", risk: 1 },
        { value: "commercial", label: "Commercial districts & business centers", risk: 2 },
        { value: "public", label: "Public venues & high-traffic areas", risk: 3 },
        { value: "high_risk", label: "High-risk or unfamiliar locations", risk: 5 },
      ]
    },
    {
      id: 5,
      question: "When do you typically require secure transport?",
      options: [
        { value: "business_hours", label: "Business hours (9 AM - 5 PM)", risk: 1 },
        { value: "extended_hours", label: "Extended hours (6 AM - 10 PM)", risk: 2 },
        { value: "late_night", label: "Late night/early morning hours", risk: 4 },
        { value: "unpredictable", label: "Unpredictable/emergency basis", risk: 5 },
      ]
    },
    {
      id: 6,
      question: "How many individuals typically travel in your security detail?",
      options: [
        { value: "individual", label: "Individual client only", risk: 1 },
        { value: "small_group", label: "2-3 people (family/small team)", risk: 2 },
        { value: "medium_group", label: "4-6 people (larger team/entourage)", risk: 3 },
        { value: "large_group", label: "7+ people (full delegation/event group)", risk: 4 },
      ]
    }
  ];

  const handleAnswer = (value, risk) => {
    const newAnswers = { ...answers, [currentQuestion]: { value, risk } };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateRiskAndProceed(newAnswers);
    }
  };

  const calculateRiskAndProceed = async (finalAnswers) => {
    const totalRisk = Object.values(finalAnswers).reduce((sum, answer) => sum + answer.risk, 0);
    const maxRisk = questions.length * 5;
    const riskPercentage = (totalRisk / maxRisk) * 100;

    let riskLevel = 'LOW';
    if (riskPercentage > 70) riskLevel = 'HIGH';
    else if (riskPercentage > 40) riskLevel = 'MEDIUM';

    // Mark assessment as completed
    const assessmentData = {
      riskLevel,
      riskScore: totalRisk,
      riskPercentage: Math.round(riskPercentage),
      answers: finalAnswers,
      completedAt: new Date().toISOString()
    };
    
    await SecurityAssessmentService.markCompleted(assessmentData);

    // Show completion message and navigate back
    Alert.alert(
      'Assessment Complete',
      `Security profile created successfully.\n\nRisk Level: ${riskLevel}\nYou can now book your secure transport.`,
      [
        {
          text: 'Continue',
          onPress: () => {
            // Navigate back to the previous screen
            navigation.goBack();
          }
        }
      ]
    );
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      navigation.goBack();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Security Assessment</Text>
        <View style={styles.placeholder} />
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.progressText}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.questionContainer}>
          <Ionicons name="shield-checkmark" size={40} color="#007AFF" style={styles.questionIcon} />
          <Text style={styles.questionText}>
            {questions[currentQuestion]?.question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion]?.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option.value, option.risk)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#007AFF" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1A1A1A',
  },
  placeholder: {
    width: 34,
  },
  progressContainer: {
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#007AFF',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  questionContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  questionIcon: {
    marginBottom: 20,
  },
  questionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    marginTop: 24,
    paddingHorizontal: 4,
  },
  optionButton: {
    backgroundColor: '#FFFFFF',
    padding: 18,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    minHeight: 64,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  optionText: {
    fontSize: 15,
    color: '#1A1A1A',
    flex: 1,
    marginRight: 16,
    lineHeight: 20,
    fontWeight: '500',
    paddingTop: 2,
  },
  onboardingNote: {
    fontSize: 12,
    color: '#D4AF37',
    textAlign: 'center',
    marginTop: 4,
    fontStyle: 'italic',
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  completedTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#ffffff',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  completedText: {
    fontSize: 16,
    color: '#cccccc',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  continueButton: {
    backgroundColor: '#00C851',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#ffffff',
  },
});

export default AssessmentScreen;