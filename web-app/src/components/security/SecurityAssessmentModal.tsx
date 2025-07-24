import React, { useState } from 'react';
import { X, Shield, ChevronRight, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

interface AssessmentQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
    risk: number;
  }[];
}

interface SecurityAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (results: any) => void;
}

const questions: AssessmentQuestion[] = [
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

const SecurityAssessmentModal: React.FC<SecurityAssessmentModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  if (!isOpen) return null;

  const handleAnswer = (value: string, risk: number) => {
    const newAnswers = { ...answers, [currentQuestion]: { value, risk } };
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results and complete
      const totalRisk = Object.values(newAnswers).reduce((sum: number, answer: any) => sum + answer.risk, 0);
      const maxRisk = questions.length * 5;
      const riskPercentage = (totalRisk / maxRisk) * 100;

      let riskLevel = 'LOW';
      if (riskPercentage > 70) riskLevel = 'HIGH';
      else if (riskPercentage > 40) riskLevel = 'MEDIUM';

      const results = {
        riskLevel,
        riskScore: totalRisk,
        riskPercentage: Math.round(riskPercentage),
        answers: newAnswers,
        completedAt: new Date().toISOString()
      };

      onComplete(results);
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      onClose();
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={goBack}
              className="p-2"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            <h2 className="text-xl font-semibold text-gray-900">Security Assessment</h2>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="progress-bar">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center mt-2">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
              <Shield className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {questions[currentQuestion]?.question}
            </h3>
          </div>

          <div className="space-y-3">
            {questions[currentQuestion]?.options.map((option, index) => (
              <Card
                key={index}
                className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02]"
                onClick={() => handleAnswer(option.value, option.risk)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-gray-900 flex-1 pr-4">
                    {option.label}
                  </span>
                  <ChevronRight className="w-5 h-5 text-primary-500" />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecurityAssessmentModal;