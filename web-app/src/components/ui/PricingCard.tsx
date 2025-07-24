import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Route, MapPin } from 'lucide-react';
import Card from './Card';

interface PricingDetails {
  service: string;
  estimatedPrice: string;
  distance: string;
  duration: string;
  pickupTime: string;
}

interface PricingCardProps {
  details: PricingDetails;
  isVisible: boolean;
}

const PricingCard: React.FC<PricingCardProps> = ({ details, isVisible }) => {
  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="mb-6"
    >
      <Card className="bg-gradient-to-br from-primary-50 to-blue-50 border-primary-200 overflow-hidden">
        <div className="relative">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center">
                <Route className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900">Trip Estimate</h3>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary-600">
                {details.estimatedPrice}
              </div>
              <div className="text-xs text-gray-500">Estimated total</div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <MapPin className="w-3 h-3 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Distance</div>
                  <div className="text-sm text-gray-600">{details.distance}</div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Clock className="w-3 h-3 text-primary-600" />
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-700">Duration</div>
                  <div className="text-sm text-gray-600">{details.duration}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Service Level</div>
                <div className="text-sm text-gray-600">{details.service}</div>
              </div>
              
              <div>
                <div className="text-sm font-medium text-gray-700 mb-1">Pickup Time</div>
                <div className="text-sm text-gray-600">{details.pickupTime}</div>
              </div>
            </div>
          </div>

          {/* Animated Background */}
          <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary-200/20 rounded-full opacity-50" />
          <div className="absolute -bottom-5 -left-5 w-20 h-20 bg-blue-200/20 rounded-full opacity-50" />
        </div>
      </Card>
    </motion.div>
  );
};

export default PricingCard;