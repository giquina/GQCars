// Web version of SecurityAssessmentService
interface AssessmentData {
  riskLevel: string;
  riskScore: number;
  riskPercentage: number;
  answers: Record<number, any>;
  completedAt: string;
}

class SecurityAssessmentService {
  private static instance: SecurityAssessmentService;
  private assessmentData: AssessmentData | null = null;
  private listeners: ((status: { isCompleted: boolean }) => void)[] = [];

  public static getInstance(): SecurityAssessmentService {
    if (!SecurityAssessmentService.instance) {
      SecurityAssessmentService.instance = new SecurityAssessmentService();
    }
    return SecurityAssessmentService.instance;
  }

  public async markCompleted(data: AssessmentData): Promise<void> {
    this.assessmentData = data;
    
    // Store in localStorage for persistence
    if (typeof window !== 'undefined') {
      localStorage.setItem('gqcars_assessment', JSON.stringify(data));
    }
    
    // Notify listeners
    this.notifyListeners();
  }

  public isAssessmentCompleted(): boolean {
    if (this.assessmentData) return true;
    
    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gqcars_assessment');
      if (stored) {
        this.assessmentData = JSON.parse(stored);
        return true;
      }
    }
    
    return false;
  }

  public getAssessmentData(): AssessmentData | null {
    if (this.assessmentData) return this.assessmentData;
    
    // Check localStorage
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gqcars_assessment');
      if (stored) {
        this.assessmentData = JSON.parse(stored);
        return this.assessmentData;
      }
    }
    
    return null;
  }

  public clearAssessment(): void {
    this.assessmentData = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('gqcars_assessment');
    }
    
    this.notifyListeners();
  }

  public addListener(callback: (status: { isCompleted: boolean }) => void): () => void {
    this.listeners.push(callback);
    
    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  private notifyListeners(): void {
    const isCompleted = this.isAssessmentCompleted();
    this.listeners.forEach(callback => {
      callback({ isCompleted });
    });
  }
}

export default SecurityAssessmentService.getInstance();