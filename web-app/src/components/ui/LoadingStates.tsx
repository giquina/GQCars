import React from 'react';
import { motion } from 'framer-motion';
import { Car, MapPin, Shield } from 'lucide-react';

export const LocationLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((item) => (
      <div key={item} className="flex items-center space-x-3 p-4 bg-white rounded-lg border border-gray-200">
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse" />
        </div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2" />
        </div>
        <div className="w-12 h-3 bg-gray-200 rounded animate-pulse" />
      </div>
    ))}
  </div>
);

export const ServiceLoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3, 4, 5].map((item) => (
      <div key={item} className="flex items-center space-x-4 p-4 bg-white rounded-lg border border-gray-200">
        <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/4" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-200 rounded animate-pulse w-1/3" />
        </div>
        <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse" />
      </div>
    ))}
  </div>
);

export const LoadingSpinner: React.FC<{ message?: string }> = ({ message = "Loading..." }) => (
  <div className="flex flex-col items-center justify-center py-12 space-y-4">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className="w-12 h-12 border-4 border-primary-200 border-t-primary-500 rounded-full"
    />
    <p className="text-gray-600 text-sm">{message}</p>
  </div>
);

export const BookingLoadingState: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
  >
    <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center">
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          rotate: [0, 5, -5, 0]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4"
      >
        <Car className="w-8 h-8 text-primary-600" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Finding Your Driver
      </h3>
      <p className="text-gray-600 text-sm mb-4">
        We're matching you with a verified security officer...
      </p>
      
      <div className="space-y-2">
        {['Verifying credentials', 'Checking availability', 'Confirming route'].map((step, index) => (
          <motion.div
            key={step}
            initial={{ opacity: 0.3 }}
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ 
              duration: 1.5,
              delay: index * 0.5,
              repeat: Infinity
            }}
            className="text-xs text-gray-500"
          >
            {step}...
          </motion.div>
        ))}
      </div>
    </div>
  </motion.div>
);

export const MapLoadingOverlay: React.FC = () => (
  <div className="absolute inset-0 bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center space-y-3">
      <motion.div
        animate={{ 
          scale: [1, 1.2, 1],
          opacity: [0.5, 1, 0.5]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center mx-auto"
      >
        <MapPin className="w-6 h-6 text-primary-600" />
      </motion.div>
      <p className="text-sm text-gray-600">Loading map...</p>
    </div>
  </div>
);

export default {
  LocationLoadingSkeleton,
  ServiceLoadingSkeleton,
  LoadingSpinner,
  BookingLoadingState,
  MapLoadingOverlay,
};