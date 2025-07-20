import AsyncStorage from '@react-native-async-storage/async-storage';

class SecurityAssessmentService {
  constructor() {
    this.listeners = [];
    this.isCompleted = false;
    this.assessmentData = null;
    this.init();
  }

  async init() {
    try {
      const completed = await AsyncStorage.getItem('security_assessment_completed');
      const data = await AsyncStorage.getItem('security_assessment_data');
      
      this.isCompleted = completed === 'true';
      this.assessmentData = data ? JSON.parse(data) : null;
      
      this.notifyListeners();
    } catch (error) {
      console.error('Error initializing SecurityAssessmentService:', error);
    }
  }

  async markCompleted(assessmentData) {
    try {
      this.isCompleted = true;
      this.assessmentData = assessmentData;
      
      await AsyncStorage.setItem('security_assessment_completed', 'true');
      await AsyncStorage.setItem('security_assessment_data', JSON.stringify(assessmentData));
      
      this.notifyListeners();
    } catch (error) {
      console.error('Error marking assessment as completed:', error);
    }
  }

  async resetAssessment() {
    try {
      this.isCompleted = false;
      this.assessmentData = null;
      
      await AsyncStorage.removeItem('security_assessment_completed');
      await AsyncStorage.removeItem('security_assessment_data');
      
      this.notifyListeners();
    } catch (error) {
      console.error('Error resetting assessment:', error);
    }
  }

  isAssessmentCompleted() {
    return this.isCompleted;
  }

  getAssessmentData() {
    return this.assessmentData;
  }

  addListener(callback) {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      this.listeners = this.listeners.filter(listener => listener !== callback);
    };
  }

  notifyListeners() {
    this.listeners.forEach(callback => {
      callback({
        isCompleted: this.isCompleted,
        assessmentData: this.assessmentData
      });
    });
  }
}

// Export singleton instance
const securityAssessmentService = new SecurityAssessmentService();
export default securityAssessmentService;