import React from 'react';
import { Shield, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

interface SecurityAssessmentBannerProps {
  isVisible?: boolean;
  onPress?: () => void;
  variant?: 'required' | 'reminder' | 'completed';
  className?: string;
}

const SecurityAssessmentBanner: React.FC<SecurityAssessmentBannerProps> = ({
  isVisible = true,
  onPress,
  variant = 'required',
  className = '',
}) => {
  if (!isVisible) return null;

  const getConfig = () => {
    switch (variant) {
      case 'completed':
        return {
          backgroundColor: 'bg-success-50',
          borderColor: 'border-success-200',
          icon: CheckCircle,
          iconColor: 'text-success-600',
          title: 'Safety Check Complete',
          subtitle: 'Your safety profile is ready',
          buttonText: 'View Profile',
          buttonColor: 'bg-success-600 hover:bg-success-700',
          urgent: false,
        };
      case 'reminder':
        return {
          backgroundColor: 'bg-warning-50',
          borderColor: 'border-warning-200',
          icon: Clock,
          iconColor: 'text-warning-600',
          title: 'Complete Safety Questions',
          subtitle: 'Quick 6-question safety check required',
          buttonText: 'Start Questions',
          buttonColor: 'bg-warning-600 hover:bg-warning-700',
          urgent: false,
        };
      default: // required
        return {
          backgroundColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          icon: Shield,
          iconColor: 'text-yellow-600',
          title: 'Safety Check Required',
          subtitle: 'Quick safety questions before your trip',
          buttonText: 'Start Questions',
          buttonColor: 'bg-yellow-600 hover:bg-yellow-700',
          urgent: true,
        };
    }
  };

  const config = getConfig();
  const IconComponent = config.icon;

  return (
    <Card 
      className={`${config.backgroundColor} ${config.borderColor} border-l-4 ${className}`}
      onClick={onPress}
    >
      <div className="flex items-center justify-between">
        {/* Left side - Icon and Text */}
        <div className="flex items-center space-x-4">
          <div className={`p-3 rounded-full ${config.backgroundColor.replace('50', '100')}`}>
            <IconComponent className={`w-6 h-6 ${config.iconColor}`} />
          </div>
          
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className={`font-semibold ${config.iconColor.replace('600', '800')}`}>
                {config.title}
              </h3>
              {config.urgent && (
                <span className="px-2 py-1 text-xs font-medium bg-yellow-200 text-yellow-800 rounded-full">
                  Required
                </span>
              )}
            </div>
            <p className="text-gray-600 text-sm mt-1">
              {config.subtitle}
            </p>
          </div>
        </div>

        {/* Right side - Action */}
        <div className="flex items-center space-x-3">
          <Button
            variant="primary"
            size="sm"
            className={config.buttonColor}
            onClick={(e) => {
              e.stopPropagation();
              onPress?.();
            }}
          >
            {config.buttonText}
          </Button>
          <ChevronRight className={`w-5 h-5 ${config.iconColor} opacity-70`} />
        </div>
      </div>
    </Card>
  );
};

export default SecurityAssessmentBanner;