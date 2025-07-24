import React from 'react';
import { Car, Plane, Calendar, Users, Crown } from 'lucide-react';
import Card from '@/components/ui/Card';

interface Service {
  id: string;
  name: string;
  basePrice: number;
  description: string;
  color: string;
  icon: string;
  badge: string;
  badgeColor: string;
}

interface ServiceSelectorProps {
  services: Service[];
  selectedService: string | null;
  onServiceSelect: (serviceId: string) => void;
  hasLocations: boolean;
}

const iconMap = {
  'car-outline': Car,
  'car-sport-outline': Crown,
  'bus-outline': Users,
  'airplane-outline': Plane,
  'calendar-outline': Calendar,
};

const ServiceSelector: React.FC<ServiceSelectorProps> = ({
  services,
  selectedService,
  onServiceSelect,
  hasLocations,
}) => {
  const calculatePrice = (service: Service, hasLocations: boolean) => {
    if (!hasLocations) return `From £${service.basePrice.toFixed(2)}`;
    // Mock calculation - in real app, this would call a pricing API
    const estimatedDistance = 5; // km
    const calculatedPrice = service.basePrice + (estimatedDistance * 1.2);
    return `£${calculatedPrice.toFixed(2)}`;
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Choose Your Service
        </h3>
        <p className="text-sm text-gray-600">
          Select your preferred security transport level
        </p>
      </div>

      <div className="space-y-3">
        {services.map((service) => {
          const IconComponent = iconMap[service.icon as keyof typeof iconMap] || Car;
          const isSelected = selectedService === service.id;
          
          return (
            <Card
              key={service.id}
              className={`cursor-pointer transition-all duration-200 border-l-4 hover:shadow-md ${
                isSelected 
                  ? 'border-primary-500 bg-primary-50 shadow-md transform scale-[1.02]' 
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onServiceSelect(service.id)}
            >
              <div className="flex items-center justify-between">
                {/* Left Side - Icon and Info */}
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: service.color + '20' }}
                  >
                    <IconComponent 
                      className="w-6 h-6" 
                      style={{ color: service.color }}
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-gray-900">
                        {service.name}
                      </h4>
                      {service.badge && (
                        <span 
                          className="px-2 py-1 text-xs font-medium rounded-full text-white"
                          style={{ backgroundColor: service.badgeColor }}
                        >
                          {service.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">
                      {service.description}
                    </p>
                    <div className="mt-2">
                      <span className="text-lg font-bold text-gray-900">
                        {calculatePrice(service, hasLocations)}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Right Side - Selection Indicator */}
                <div className="flex-shrink-0">
                  <div 
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      isSelected 
                        ? 'border-primary-500 bg-primary-500' 
                        : 'border-gray-300'
                    }`}
                  >
                    {isSelected && (
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ServiceSelector;