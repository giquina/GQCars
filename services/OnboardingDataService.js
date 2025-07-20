import AsyncStorage from '@react-native-async-storage/async-storage';

class OnboardingDataService {
  constructor() {
    this.onboardingAnswers = {};
    this.listeners = [];
    this.init();
  }

  async init() {
    try {
      const stored = await AsyncStorage.getItem('onboarding_answers');
      this.onboardingAnswers = stored ? JSON.parse(stored) : {};
      this.notifyListeners();
    } catch (error) {
      console.error('Error initializing OnboardingDataService:', error);
    }
  }

  async saveAnswer(questionId, answer) {
    try {
      this.onboardingAnswers[questionId] = {
        ...answer,
        answeredAt: new Date().toISOString()
      };
      
      await AsyncStorage.setItem('onboarding_answers', JSON.stringify(this.onboardingAnswers));
      this.notifyListeners();
    } catch (error) {
      console.error('Error saving onboarding answer:', error);
    }
  }

  getAnswers() {
    return this.onboardingAnswers;
  }

  getAnswer(questionId) {
    return this.onboardingAnswers[questionId] || null;
  }

  // Calculate preliminary risk score from onboarding answers
  getPreliminaryRiskProfile() {
    const answers = Object.values(this.onboardingAnswers);
    if (answers.length === 0) return null;

    const totalRisk = answers.reduce((sum, answer) => sum + (answer.risk || 1), 0);
    const avgRisk = totalRisk / answers.length;

    let riskLevel = 'LOW';
    if (avgRisk >= 4) riskLevel = 'HIGH';
    else if (avgRisk >= 2.5) riskLevel = 'MEDIUM';

    // Generate service recommendations based on profile
    const recommendations = this.generateServiceRecommendations(answers);

    return {
      riskLevel,
      averageRisk: avgRisk,
      answersCount: answers.length,
      recommendations,
      lastUpdated: new Date().toISOString()
    };
  }

  generateServiceRecommendations(answers) {
    const recommendations = [];
    
    // Find specific answers to customize recommendations
    const purposeAnswer = answers.find(a => a.value === 'executive' || a.value === 'event');
    const timeAnswer = answers.find(a => a.value === 'late_night' || a.value === 'unpredictable');
    const threatAnswer = answers.find(a => a.value === 'elevated' || a.value === 'high');

    // High-risk scenarios get Executive service
    if (purposeAnswer?.value === 'executive' || threatAnswer?.value === 'elevated' || threatAnswer?.value === 'high') {
      recommendations.push({
        service: 'executive',
        reason: 'Executive protection recommended for your security profile',
        priority: 'high'
      });
    }
    // Event transport or late night travel gets Executive
    else if (purposeAnswer?.value === 'event' || timeAnswer?.value === 'late_night' || timeAnswer?.value === 'unpredictable') {
      recommendations.push({
        service: 'executive',
        reason: 'Enhanced security recommended for your travel patterns',
        priority: 'medium'
      });
    }
    // Corporate transport gets Standard with professional driver
    else if (purposeAnswer?.value === 'corporate') {
      recommendations.push({
        service: 'standard',
        reason: 'Professional security driver suitable for corporate travel',
        priority: 'medium'
      });
    }
    // Default to Standard for general protection
    else {
      recommendations.push({
        service: 'standard',
        reason: 'Professional security driver for general protection',
        priority: 'medium'
      });
    }

    return recommendations;
  }

  async clearData() {
    try {
      this.onboardingAnswers = {};
      await AsyncStorage.removeItem('onboarding_answers');
      this.notifyListeners();
    } catch (error) {
      console.error('Error clearing onboarding data:', error);
    }
  }

  addListener(callback) {
    this.listeners.push(callback);
    
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        answers: this.onboardingAnswers,
        riskProfile: this.getPreliminaryRiskProfile()
      });
    });
  }
}

// Export singleton instance
const onboardingDataService = new OnboardingDataService();
export default onboardingDataService;