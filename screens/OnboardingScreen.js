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
    title: '🌙 When Safety Matters Most',
    subtitle: 'Late nights, high-value meetings, unfamiliar areas – some journeys need more than just a ride.',
    description: 'You need a trained security professional who understands protection.',
    icon: 'shield-checkmark',
    color: theme.colors.primary,
    gradient: [theme.colors.primary, theme.colors.primaryDark],
    type: 'info',
    stats: '24/7 Protection',
    highlight: 'Professional Security'
  },
  {
    id: 2,
    title: '🎖️ SIA Licensed Security Officers',
    subtitle: 'Every driver is a vetted close protection officer with professional security training.',
    description: 'Get executive-level protection at everyday prices.',
    icon: 'person-circle',
    color: '#FF6B35',
    gradient: ['#FF6B35', '#FF8A5C'],
    type: 'info',
    stats: '100% Licensed',
    highlight: 'Vetted Professionals'
  },
  {
    id: 3,
    title: '🚗 Book Instantly, Travel Securely',
    subtitle: 'Professional security transport in just a few taps.',
    description: 'Premium protection without the premium price tag. Your safety, simplified.',
    icon: 'car-sport',
    color: '#2E8B57',
    gradient: ['#2E8B57', '#3CB371'],
    type: 'info',
    stats: 'Instant Booking',
    highlight: 'Premium Protection'
  },
  {
    id: 4,
    title: '🛡️ Your Security Profile',
    subtitle: 'Help us understand your protection requirements',
    description: 'This helps us match you with the right security level',
    icon: 'shield',
    color: '#6A5ACD',
    gradient: ['#6A5ACD', '#8A2BE2'],
    type: 'question',
    question: 'What is your primary security transport requirement?',
    options: [
      { value: 'executive', label: '👔 Executive/VIP Protection', emoji: '👔', risk: 4 },
      { value: 'corporate', label: '🏢 Corporate Travel Security', emoji: '🏢', risk: 3 },
      { value: 'personal', label: '🔒 Personal Safety & Discretion', emoji: '🔒', risk: 2 },
      { value: 'event', label: '🎭 Event & Public Appearance', emoji: '🎭', risk: 4 }
    ]
  },
  {
    id: 5,
    title: '⏰ Travel Risk Assessment',
    subtitle: 'Time-based security considerations matter',
    description: 'Different times require different security protocols',
    icon: 'time',
    color: '#FF6347',
    gradient: ['#FF6347', '#FF7F50'],
    type: 'question',
    question: 'When do you typically require secure transport?',
    options: [
      { value: 'business_hours', label: '☀️ Business Hours (9 AM - 5 PM)', emoji: '☀️', risk: 1 },
      { value: 'extended_hours', label: '🌅 Extended Hours (6 AM - 10 PM)', emoji: '🌅', risk: 2 },
      { value: 'late_night', label: '🌙 Late Night/Early Morning', emoji: '🌙', risk: 4 },
      { value: 'unpredictable', label: '🚨 Unpredictable/Emergency Basis', emoji: '🚨', risk: 5 }
    ]
  },
  {
    id: 6,
    title: '🎯 Threat Assessment Level',
    subtitle: 'This determines your security protocol',
    description: 'We tailor protection based on your specific risk profile',
    icon: 'analytics',
    color: '#20B2AA',
    gradient: ['#20B2AA', '#48D1CC'],
    type: 'question',
    question: 'What best describes your current threat level?',
    options: [
      { value: 'minimal', label: '🟢 Minimal Risk - General Precaution', emoji: '🟢', risk: 1 },
      { value: 'moderate', label: '🟡 Moderate Risk - Business Executive', emoji: '🟡', risk: 3 },
      { value: 'elevated', label: '🟠 Elevated Risk - Public Figure', emoji: '🟠', risk: 4 },
      { value: 'high', label: '🔴 High Risk - Specific Threats Known', emoji: '🔴', risk: 5 }
    ]
  }
];

const OnboardingScreen = ({ navigation }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const scrollRef = useRef(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  // Helper function for risk level colors
  const getRiskColor = (risk) => {
    switch (risk) {
      case 1: return '#10B981'; // Green
      case 2: return '#F59E0B'; // Yellow
      case 3: return '#F97316'; // Orange
      case 4: return '#EF4444'; // Red
      case 5: return '#DC2626'; // Dark Red
      default: return theme.colors.gray400;
    }
  };

  // Animation effect when slide changes
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, [currentIndex]);

  const handleNext = () => {
    const currentSlide = onboardingData[currentIndex];

    // If it's a question slide, require an answer
    if (currentSlide.type === 'question' && !selectedAnswers[currentSlide.id]) {
      return; // Don't proceed without an answer
    }

    if (currentIndex < onboardingData.length - 1) {
      // Reset animations for next slide
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.8);

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
        {/* Enhanced Background with Gradient */}
        <View style={styles.backgroundDecoration}>
          <View style={[styles.decorativeCircle, styles.decorativeCircle1, { backgroundColor: item.color + '10' }]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle2, { backgroundColor: item.color + '15' }]} />
          <View style={[styles.decorativeCircle, styles.decorativeCircle3, { backgroundColor: item.color + '08' }]} />
        </View>

        <View style={styles.contentWrapper}>
          {/* Enhanced Icon Container with Stats */}
          <Animated.View
            style={[
              styles.iconContainer,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <View style={styles.iconInner}>
                <Ionicons name={item.icon} size={72} color={theme.colors.surface} />
              </View>
              {/* Floating stats badge */}
              <View style={[styles.statsBadge, { backgroundColor: theme.colors.surface, borderColor: item.color }]}>
                <Text style={[styles.statsText, { color: item.color }]}>{item.stats}</Text>
              </View>
            </View>
            {/* Enhanced floating elements */}
            <View style={[styles.floatingDot, styles.floatingDot1, { backgroundColor: item.color + '40' }]} />
            <View style={[styles.floatingDot, styles.floatingDot2, { backgroundColor: item.color + '60' }]} />
            <View style={[styles.floatingDot, styles.floatingDot3, { backgroundColor: item.color + '30' }]} />
            <View style={[styles.floatingDot, styles.floatingDot4, { backgroundColor: item.color + '20' }]} />
          </Animated.View>

          {/* Enhanced Text Container */}
          <View style={styles.textContainer}>
            <View style={[styles.highlightBadge, { backgroundColor: item.color + '15' }]}>
              <Text style={[styles.highlightText, { color: item.color }]}>{item.highlight}</Text>
            </View>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            {item.description && (
              <Text style={styles.description}>{item.description}</Text>
            )}
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
            
            {/* Enhanced Options Grid */}
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
                    {/* Emoji Icon */}
                    <View style={styles.optionEmojiContainer}>
                      <Text style={styles.optionEmoji}>{option.emoji}</Text>
                    </View>

                    {/* Selection Indicator */}
                    {selectedAnswer?.value === option.value && (
                      <View style={styles.selectedIndicator}>
                        <Ionicons name="checkmark-circle" size={20} color={theme.colors.surface} />
                      </View>
                    )}

                    {/* Option Text */}
                    <Text style={[
                      styles.optionChipText,
                      selectedAnswer?.value === option.value && styles.optionChipTextSelected
                    ]} numberOfLines={2}>
                      {option.label.replace(/^[🔴🟠🟡🟢👔🏢🔒🎭☀️🌅🌙🚨]\s*/, '')}
                    </Text>

                    {/* Risk Level Indicator */}
                    <View style={[styles.riskIndicator, { backgroundColor: getRiskColor(option.risk) }]}>
                      <Text style={styles.riskText}>Risk: {option.risk}/5</Text>
                    </View>
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
          <Text style={styles.logo}>🛡️ GQCars</Text>
          <Text style={styles.logoSubtext}>Security Transport</Text>
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
  logoSubtext: {
    ...theme.typography.bodySmall,
    color: theme.colors.textSecondary,
    marginTop: 2,
    fontWeight: '500',
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
  decorativeCircle3: {
    width: 80,
    height: 80,
    top: '60%',
    right: '10%',
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
  floatingDot4: {
    width: 12,
    height: 12,
    bottom: 10,
    right: -40,
  },
  statsBadge: {
    position: 'absolute',
    top: -10,
    right: -10,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 2,
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsText: {
    fontSize: 10,
    fontWeight: '700',
  },
  highlightBadge: {
    alignSelf: 'center',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginBottom: theme.spacing.md,
  },
  highlightText: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    ...theme.typography.bodyMedium,
    color: theme.colors.textLight,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    lineHeight: 20,
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
    borderRadius: 20,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
    borderWidth: 2,
    borderColor: theme.colors.gray200,
    minWidth: '47%',
    maxWidth: '47%',
    shadowColor: theme.colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    position: 'relative',
  },
  optionChipSelected: {
    borderWidth: 2,
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  optionChipContent: {
    alignItems: 'center',
    minHeight: 60,
    justifyContent: 'center',
    position: 'relative',
  },
  optionEmojiContainer: {
    marginBottom: theme.spacing.sm,
  },
  optionEmoji: {
    fontSize: 24,
    textAlign: 'center',
  },
  selectedIndicator: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: theme.colors.success,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.surface,
  },
  riskIndicator: {
    marginTop: theme.spacing.xs,
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  riskText: {
    fontSize: 9,
    color: theme.colors.surface,
    fontWeight: '600',
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