import React from 'react';
import { ArrowRight, Shield, MapPin, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import Button from './Button';

interface FloatingBookingButtonProps {
  canBook: boolean;
  assessmentCompleted: boolean;
  selectedService: string | null;
  hasLocations: boolean;
  onPress: () => void;
  buttonText: string;
  buttonSubtext: string;
}

const FloatingBookingButton: React.FC<FloatingBookingButtonProps> = ({
  canBook,
  assessmentCompleted,
  selectedService,
  hasLocations,
  onPress,
  buttonText,
  buttonSubtext,
}) => {
  return (
    <motion.div
      className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50"
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="max-w-md mx-auto px-4"
      >
        <Button
          variant={canBook ? "success" : "primary"}
          size="lg"
          fullWidth
          disabled={!canBook}
          onClick={onPress}
          className={`
            relative overflow-hidden h-16 rounded-2xl shadow-2xl border-0
            ${canBook 
              ? 'bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700' 
              : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700'
            }
            ${!canBook ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          {/* Background Animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          <div className="flex items-center justify-between w-full relative z-10">
            <div className="flex-1 text-left">
              <div className="font-bold text-lg text-white leading-tight">
                {buttonText}
              </div>
              <div className="text-sm text-white/90 leading-tight">
                {buttonSubtext}
              </div>
            </div>
            
            <div className="flex items-center space-x-2 ml-4">
              {/* Progress Indicators */}
              <div className="flex space-x-1">
                <div className={`w-2 h-2 rounded-full ${assessmentCompleted ? 'bg-white' : 'bg-white/40'}`} />
                <div className={`w-2 h-2 rounded-full ${selectedService ? 'bg-white' : 'bg-white/40'}`} />
                <div className={`w-2 h-2 rounded-full ${hasLocations ? 'bg-white' : 'bg-white/40'}`} />
              </div>
              
              <ArrowRight className="w-6 h-6 text-white ml-2" />
            </div>
          </div>
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default FloatingBookingButton;