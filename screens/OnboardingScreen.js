import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Image,
  Dimensions,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../components/ui/Button';
import OnboardingDataService from '../services/OnboardingDataService';
import theme from '../theme';

const { width, height } = Dimensions.get('window');

const onboardingData = [
  {
    id: 1,
    title: 'When Safety Matters Most',
    subtitle: 'Late nights, high-value meetings, unfamiliar areas – some journeys need more than just a ride. You need a trained security professional who understands protection.',
    icon: 'shield-checkmark-outline',
    color: theme.colors.primary,
    type: 'info'
  },
  {
    id: 2,
    title: 'SIA Licensed Security Officers',
    subtitle: 'Every driver is a vetted close protection officer with professional security training. Get executive-level protection at everyday prices.',
    icon: 'person-circle-outline',
    color: '#FF6B35',
    type: 'info'
  },
  {
    id: 3,
    title: 'Book Instantly, Travel Securely',
    subtitle: 'Professional security transport in just a few taps. Premium protection without the premium price tag. Your safety, simplified.',
    icon: 'car-outline',
    color: '#2E8B57',
    type: 'info'
  },
  {
    id: 4,
    title: 'Your Security Profile',
    subtitle: 'Help us understand your protection requirements',
    icon: 'shield-outline',
    color: '#6A5ACD',
    type: 'question',
    question: 'What is your primary security transport requirement?',
    options: [
      { value: 'executive', label: 'Executive/VIP Protection', risk: 4 },
      { value: 'corporate', label: 'Corporate Travel Security', risk: 3 },
      { value: 'personal', label: 'Personal Safety & Discretion', risk: 2 },
      { value: 'event', label: 'Event & Public Appearance Transport', risk: 4 }
    ]
  },
  {
    id: 5,
    title: 'Travel Risk Assessment',
    subtitle: 'Time-based security considerations matter',
    icon: 'time-outline',
    color: '#FF6347',
    type: 'question',
    question: 'When do you typically require secure transport?',
    options: [
      { value: 'business_hours', label: 'Business Hours (9 AM - 5 PM)', risk: 1 },
      { value: 'extended_hours', label: 'Extended Hours (6 AM - 10 PM)', risk: 2 },
      { value: 'late_night', label: 'Late Night/Early Morning', risk: 4 },
      { value: 'unpredictable', label: 'Unpredictable/Emergency Basis', risk: 5 }
    ]
  },
  {
    id: 6,
    title: 'Threat Assessment Level',
    subtitle: 'This determines your security protocol',
    icon: 'person-outline',
    color: '#20B2AA',
    type: 'question',
    question: 'What best describes your current threat level?',
    options: [
      { value: 'minimal', label: 'Minimal Risk - General Precaution', risk: 1 },
      { value: 'moderate', label: 'Moderate Risk - Business Executive', risk: 3 },
      { value: 'elevated', label: 'Elevated Risk - Public Figure', risk: 4 },
      { value: 'high', label: 'High Risk - Specific Threats Known', risk: 5 }
    ]
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const scrollRef = useRef(null);

  const handleNext = () => {
    const currentSlide = onboardingData[currentIndex];
    
    // If it's a question slide, require an answer
    if (currentSlide.type === 'question' && !selectedAnswers[currentSlide.id]) {
      return; // Don't proceed without an answer
    }
    
    if (currentIndex < onboardingData.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * width,
        animated: true,
      });
    } else {
      // Save all answers before finishing onboarding
      handleFinishOnboarding();
    }
  };

  const handleFinishOnboarding = async () => {
    // Save all collected answers
    for (const [questionId, answer] of Object.entries(selectedAnswers)) {
      await OnboardingDataService.saveAnswer(questionId, answer);
    }
    
    navigation.replace('Main');
  };

  const handleAnswerSelect = (questionId, answer) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleSkip = () => {
    navigation.replace('Main');
  };

  const handleScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const newIndex = Math.round(contentOffsetX / width);
    setCurrentIndex(newIndex);
  };

  const renderOnboardingItem = ({ item }) => {
    if (item.type === 'question') {
      return renderQuestionSlide(item);
    }
    return renderInfoSlide(item);
  };

  const renderInfoSlide = (item) => {
    return (
      <View style={styles.slideContainer}>
        {/* Background decorative elements */}
        <View style={styles.backgroundDecoration}>
          <View style={[styles.decorativeCircle, styles.decorativeCircle1]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2]} />
        </View>
        
        <View style={styles.contentWrapper}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <View style={styles.iconInner}>
                <Ionicons name={item.icon} size={64} color={theme.colors.surface} />
              </View>
            </View>
            {/* Floating elements around icon */}
            <View style={[styles.floatingDot, styles.floatingDot1, { backgroundColor: item.color + '40' }]} />
            <View style={[styles.floatingDot, styles.floatingDot2, { backgroundColor: item.color + '60' }]} />
            <View style={[styles.floatingDot, styles.floatingDot3, { backgroundColor: item.color + '30' }]} />
          </View>
          
          <View style={styles.textContainer}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
          </View>
          
          {/* Centered button area */}
          <View style={styles.buttonArea}>
            <Button
              title={currentIndex === onboardingData.length - 1 ? 'Get Started' : 'Continue'}
              onPress={handleNext}
              style={styles.centeredButton}
            />
            
            {/* Progress indicator */}
            <View style={styles.progressContainer}>
              <View style={styles.progressBar}>
                <View 
                  style={[
                    styles.progressFill, 
                    { 
                      width: `${((currentIndex + 1) / onboardingData.length) * 100}%`,
                      backgroundColor: item.color 
                    }
                  ]} 
                />
              </View>
              <Text style={styles.progressText}>
                {currentIndex + 1} of {onboardingData.length}
              </Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  const renderQuestionSlide = (item) => {
    const selectedAnswer = selectedAnswers[item.id];
    
    return (
      <View style={styles.slideContainer}>
        <ScrollView 
          style={styles.questionScrollView}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <View style={styles.questionWrapper}>
            {/* Compact Question Header */}
            <View style={styles.questionHeader}>
              <View style={[styles.questionIconCircle, { backgroundColor: item.color }]}>
                <Ionicons name={item.icon} size={28} color={theme.colors.surface} />
              </View>
              <Text style={styles.questionTitle}>{item.title}</Text>
              <Text style={styles.questionSubtitle}>{item.subtitle}</Text>
            </View>
            
            {/* Compact Question Text */}
            <View style={styles.questionTextContainer}>
              <Text style={styles.questionText}>{item.question}</Text>
            </View>
            
            {/* Compact Options Grid */}
            <View style={styles.optionsGrid}>
              {item.options.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionChip,
                    selectedAnswer?.value === option.value && [
                      styles.optionChipSelected,
                      { backgroundColor: item.color, borderColor: item.color }
                    ]
                  ]}
                  onPress={() => handleAnswerSelect(item.id, option)}
                  activeOpacity={0.8}
                >
                  <View style={styles.optionChipContent}>
                    {selectedAnswer?.value === option.value && (
                      <Ionicons name="checkmark" size={14} color={theme.colors.surface} style={styles.optionCheckmark} />
                    )}
                    <Text style={[
                      styles.optionChipText,
                      selectedAnswer?.value === option.value && styles.optionChipTextSelected
                    ]} numberOfLines={2}>
                      {option.label}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
        
        {/* Fixed Bottom Button Area */}
        <View style={styles.questionBottomFixed}>
          <Button
            title={currentIndex === onboardingData.length - 1 ? 'Complete Setup' : 'Continue'}
            onPress={handleNext}
            style={[
              styles.questionButton,
              { backgroundColor: item.color },
              !selectedAnswer && styles.buttonDisabled
            ]}
            disabled={!selectedAnswer}
          />
          
          {/* Progress indicator */}
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: `${((currentIndex + 1) / onboardingData.length) * 100}%`,
                    backgroundColor: item.color 
                  }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentIndex + 1} of {onboardingData.length}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderPagination = () => {
    return (
      <View style={styles.pagination}>
        {onboardingData.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              {
                backgroundColor: index === currentIndex ? theme.colors.primary : theme.colors.gray300,
                width: index === currentIndex ? 24 : 8,
              },
            ]}
          />
        ))}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={theme.colors.background} />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.logoContainer}>
          <Text style={styles.logo}>GQCars</Text>
        </View>
        <Button
          title="Skip"
          variant="ghost"
          size="small"
          onPress={handleSkip}
        />
      </View>

      {/* Onboarding Content */}
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={styles.scrollView}
      >
        {onboardingData.map((item) => (
          <View key={item.id} style={styles.slide}>
            {renderOnboardingItem({ item })}
          </View>
        ))}
      </ScrollView>

      {/* Bottom pagination dots only */}
      <View style={styles.bottomPagination}>
        {renderPagination()}
      </View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  logoContainer: {
    flex: 1,
  },
  logo: {
    ...theme.typography.headlineLarge,
    color: theme.colors.primary,
    fontWeight: '700',
  },
  scrollView: {
    flex: 1,
  },
  slide: {
    width,
    flex: 1,
  },
  slideContainer: {
    flex: 1,
    position: 'relative',
    paddingHorizontal: theme.spacing.lg,
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  decorativeCircle: {
    position: 'absolute',
    backgroundColor: theme.colors.primary + '08',
    borderRadius: 1000,
  },
  decorativeCircle1: {
    width: 200,
    height: 200,
    top: '10%',
    right: '-15%',
  },
  decorativeCircle2: {
    width: 120,
    height: 120,
    bottom: '25%',
    left: '-10%',
  },
  contentWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xxxl,
  },
  iconContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: theme.spacing.xl,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  iconInner: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  floatingDot: {
    position: 'absolute',
    borderRadius: 1000,
  },
  floatingDot1: {
    width: 16,
    height: 16,
    top: 20,
    right: 10,
  },
  floatingDot2: {
    width: 12,
    height: 12,
    bottom: 30,
    left: 15,
  },
  floatingDot3: {
    width: 20,
    height: 20,
    top: 60,
    left: -10,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    flex: 1,
    justifyContent: 'center',
  },
  buttonArea: {
    alignItems: 'center',
    width: '100%',
    paddingBottom: theme.spacing.lg,
  },
  centeredButton: {
    width: '85%',
    maxWidth: 300,
    marginBottom: theme.spacing.lg,
    borderRadius: 25,
    paddingVertical: theme.spacing.lg,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  progressContainer: {
    alignItems: 'center',
    width: '100%',
  },
  progressBar: {
    width: '60%',
    height: 4,
    backgroundColor: theme.colors.gray200,
    borderRadius: 2,
    marginBottom: theme.spacing.sm,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  progressText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  title: {
    ...theme.typography.displayMedium,
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.md,
  },
  subtitle: {
    ...theme.typography.bodyLarge,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
  bottomPagination: {
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  paginationDot: {
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
    opacity: 0.7,
  },
  // Question slide styles - Mobile optimized
  questionScrollView: {
    flex: 1,
  },
  questionWrapper: {
    paddingHorizontal: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  questionHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  questionIconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  questionTitle: {
    fontSize: 20,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '700',
    marginBottom: theme.spacing.xs,
  },
  questionSubtitle: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
  },
  questionTextContainer: {
    marginBottom: theme.spacing.lg,
  },
  questionText: {
    fontSize: 16,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '600',
    lineHeight: 22,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    justifyContent: 'center',
  },
  optionChip: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    borderWidth: 1.5,
    borderColor: theme.colors.gray200,
    minWidth: '47%',
    maxWidth: '47%',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  optionChipSelected: {
    borderWidth: 2,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  optionChipContent: {
    alignItems: 'center',
    minHeight: 44,
    justifyContent: 'center',
  },
  optionCheckmark: {
    marginBottom: theme.spacing.xs,
  },
  optionChipText: {
    fontSize: 12,
    color: theme.colors.text,
    textAlign: 'center',
    fontWeight: '500',
    lineHeight: 15,
  },
  optionChipTextSelected: {
    color: theme.colors.surface,
    fontWeight: '600',
  },
  questionBottomFixed: {
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.gray100,
  },
  questionButton: {
    borderRadius: 16,
    paddingVertical: theme.spacing.lg,
    marginBottom: theme.spacing.md,
  },
  buttonDisabled: {
    backgroundColor: theme.colors.gray400,
    opacity: 0.6,
  },
};

export default OnboardingScreen;