import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Shield, Car, MapPin } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  completed: boolean;
}

interface AnimatedProgressProps {
  assessmentCompleted: boolean;
  selectedService: string | null;
  hasLocations: boolean;
}

const AnimatedProgress: React.FC<AnimatedProgressProps> = ({
  assessmentCompleted,
  selectedService,
  hasLocations,
}) => {
  const steps: Step[] = [
    {
      id: 'assessment',
      label: 'Security Assessment',
      icon: Shield,
      completed: assessmentCompleted,
    },
    {
      id: 'service',
      label: 'Choose Service',
      icon: Car,
      completed: !!selectedService,
    },
    {
      id: 'locations',
      label: 'Set Locations',
      icon: MapPin,
      completed: hasLocations,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-primary-50 to-blue-50 rounded-2xl p-6 border border-primary-100">
      <h3 className="font-semibold text-gray-900 mb-6 text-center text-lg">
        Complete These Steps to Book
      </h3>
      
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 -z-10" />
        <motion.div
          className="absolute top-5 left-0 h-0.5 bg-primary-500 -z-10"
          initial={{ width: '0%' }}
          animate={{ 
            width: `${(steps.filter(s => s.completed).length / steps.length) * 100}%` 
          }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
        
        {steps.map((step, index) => {
          const IconComponent = step.icon;
          
          return (
            <motion.div
              key={step.id}
              className="flex flex-col items-center space-y-3"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ 
                delay: index * 0.2,
                duration: 0.5,
                ease: "easeOut"
              }}
            >
              <motion.div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                  ${step.completed 
                    ? 'bg-primary-500 border-primary-500 text-white' 
                    : 'bg-white border-gray-300 text-gray-400'
                  }
                `}
                whileHover={{ scale: 1.1 }}
                animate={step.completed ? { 
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {step.completed ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <IconComponent className="w-5 h-5" />
                )}
              </motion.div>
              
              <span 
                className={`
                  text-sm font-medium transition-colors duration-300
                  ${step.completed ? 'text-primary-600' : 'text-gray-500'}
                `}
              >
                {step.label}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default AnimatedProgress;