import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { ArrowLeft, Shield, ChevronRight } from 'lucide-react';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import SecurityAssessmentService from '@/services/SecurityAssessmentService';

interface AssessmentQuestion {
  id: number;
  question: string;
  options: {
    value: string;
    label: string;
    risk: number;
  }[];
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

export default function SecurityAssessment() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const handleAnswer = async (value: string, risk: number) => {
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

      await SecurityAssessmentService.markCompleted(results);
      
      alert(`Assessment Complete!\n\nRisk Level: ${riskLevel}\nYou can now book your secure transport.`);
      router.push('/');
    }
  };

  const goBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    } else {
      router.push('/');
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="secondary"
                size="sm"
                onClick={goBack}
                className="p-2"
              >
                <ArrowLeft className="w-4 h-4" />
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">
                Security Assessment
              </h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Bar */}
        <Card className="p-6 mb-8">
          <div className="progress-bar mb-4">
            <div 
              className="progress-fill"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-gray-600 text-center">
            Question {currentQuestion + 1} of {questions.length}
          </p>
        </Card>

        {/* Question */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary-100 rounded-full mb-6">
            <Shield className="w-10 h-10 text-primary-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {questions[currentQuestion]?.question}
          </h2>
        </div>

        {/* Options */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {questions[currentQuestion]?.options.map((option, index) => (
            <Card
              key={index}
              className="cursor-pointer hover:shadow-md transition-all duration-200 hover:scale-[1.02] p-6"
              onClick={() => handleAnswer(option.value, option.risk)}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 pr-4">
                  <p className="text-gray-900 font-medium">
                    {option.label}
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-primary-500 flex-shrink-0" />
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}