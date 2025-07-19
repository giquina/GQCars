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

const AssessmentScreen = ({ navigation, route }) => {

  // Get selected service from route params
  const { service } = route.params || {};
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});

  const questions = [
    {
      id: 1,
      question: "What is your primary reason for requiring security transport?",
      options: [
        { value: "executive", label: "Executive Protection", risk: 3 },
        { value: "diplomatic", label: "Diplomatic Mission", risk: 5 },
        { value: "personal", label: "Personal Security Concern", risk: 2 },
        { value: "event", label: "High-Profile Event", risk: 4 },
      ]
    },
    {
      id: 2,
      question: "Have you received any recent security threats?",
      options: [
        { value: "none", label: "No known threats", risk: 1 },
        { value: "verbal", label: "Verbal threats received", risk: 3 },
        { value: "written", label: "Written/digital threats", risk: 4 },
        { value: "physical", label: "Physical intimidation", risk: 5 },
      ]
    },
    {
      id: 3,
      question: "What is the nature of your public profile?",
      options: [
        { value: "private", label: "Private individual", risk: 1 },
        { value: "business", label: "Business executive", risk: 2 },
        { value: "public", label: "Public figure", risk: 4 },
        { value: "celebrity", label: "High-profile celebrity/politician", risk: 5 },
      ]
    },
    {
      id: 4,
      question: "Which areas will you be traveling to?",
      options: [
        { value: "low", label: "Low-risk residential areas", risk: 1 },
        { value: "commercial", label: "Commercial districts", risk: 2 },
        { value: "high_traffic", label: "High-traffic public areas", risk: 3 },
        { value: "high_risk", label: "Known high-risk locations", risk: 5 },
      ]
    },
    {
      id: 5,
      question: "What time of day will most travel occur?",
      options: [
        { value: "day", label: "Daytime hours (9 AM - 6 PM)", risk: 1 },
        { value: "evening", label: "Evening hours (6 PM - 10 PM)", risk: 2 },
        { value: "night", label: "Night hours (10 PM - 6 AM)", risk: 3 },
        { value: "varied", label: "Varied/unpredictable times", risk: 4 },
      ]
    },
    {
      id: 6,
      question: "How many people will require protection?",
      options: [
        { value: "solo", label: "Just myself", risk: 1 },
        { value: "small", label: "2-3 people", risk: 2 },
        { value: "medium", label: "4-6 people", risk: 3 },
        { value: "large", label: "7+ people", risk: 4 },
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

  const calculateRiskAndProceed = (finalAnswers) => {
    const totalRisk = Object.values(finalAnswers).reduce((sum, answer) => sum + answer.risk, 0);
    const maxRisk = questions.length * 5;
    const riskPercentage = (totalRisk / maxRisk) * 100;

    let riskLevel = 'LOW';
    if (riskPercentage > 70) riskLevel = 'HIGH';
    else if (riskPercentage > 40) riskLevel = 'MEDIUM';

    navigation.navigate('Booking', {
      service,
      riskLevel,
      riskScore: totalRisk,
      riskPercentage: Math.round(riskPercentage),
      answers: finalAnswers
    });
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
          <Ionicons name="arrow-back" size={24} color="#D4AF37" />
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
          <Ionicons name="shield-checkmark" size={40} color="#D4AF37" style={styles.questionIcon} />
          <Text style={styles.questionText}>
            {questions[currentQuestion].question}
          </Text>
        </View>

        <View style={styles.optionsContainer}>
          {questions[currentQuestion].options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={styles.optionButton}
              onPress={() => handleAnswer(option.value, option.risk)}
            >
              <Text style={styles.optionText}>{option.label}</Text>
              <Ionicons name="chevron-forward" size={20} color="#D4AF37" />
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
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333333',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  placeholder: {
    width: 34,
  },
  progressContainer: {
    padding: 20,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#333333',
    borderRadius: 2,
    marginBottom: 10,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#D4AF37',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    color: '#cccccc',
    textAlign: 'center',
  },
  content: {
    flex: 1,
    padding: 20,
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
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 28,
  },
  optionsContainer: {
    marginTop: 20,
  },
  optionButton: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    borderRadius: 12,
    marginBottom: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#333333',
  },
  optionText: {
    fontSize: 16,
    color: '#ffffff',
    flex: 1,
    marginRight: 10,
  },
});

export default AssessmentScreen;