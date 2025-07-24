import React, { useState, useCallback } from 'react';
import { View, ScrollView, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import Card from '../ui/Card';
import Button from '../ui/Button';

const BookingWizard = ({
  children,
  steps = [],
  currentStep = 0,
  onStepChange,
  onComplete,
  onCancel,
  showProgress = true,
  allowSkipSteps = false,
  style,
  headerStyle,
  contentStyle,
  ...props
}) => {
  const [internalStep, setInternalStep] = useState(currentStep);
  
  const activeStep = onStepChange ? currentStep : internalStep;
  const totalSteps = steps.length;

  const handleNext = useCallback(() => {
    if (activeStep < totalSteps - 1) {
      const nextStep = activeStep + 1;
      if (onStepChange) {
        onStepChange(nextStep);
      } else {
        setInternalStep(nextStep);
      }
    } else if (onComplete) {
      onComplete();
    }
  }, [activeStep, totalSteps, onStepChange, onComplete]);

  const handlePrevious = useCallback(() => {
    if (activeStep > 0) {
      const prevStep = activeStep - 1;
      if (onStepChange) {
        onStepChange(prevStep);
      } else {
        setInternalStep(prevStep);
      }
    }
  }, [activeStep, onStepChange]);

  const handleStepPress = useCallback((stepIndex) => {
    if (allowSkipSteps || stepIndex <= activeStep) {
      if (onStepChange) {
        onStepChange(stepIndex);
      } else {
        setInternalStep(stepIndex);
      }
    }
  }, [activeStep, allowSkipSteps, onStepChange]);

  const getProgressBarStyle = () => ({
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.lg,
  });

  const getStepIndicatorStyle = (stepIndex) => ({
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: stepIndex <= activeStep ? theme.colors.primary : theme.colors.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: theme.spacing.xs,
  });

  const getStepConnectorStyle = (stepIndex) => ({
    flex: 1,
    height: 2,
    backgroundColor: stepIndex < activeStep ? theme.colors.primary : theme.colors.gray300,
    marginHorizontal: theme.spacing.xs,
  });

  const getStepTextStyle = (stepIndex) => ({
    ...theme.typography.labelSmall,
    color: stepIndex <= activeStep ? theme.colors.primary : theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.xs,
    maxWidth: 80,
  });

  const renderProgressBar = () => {
    if (!showProgress || totalSteps <= 1) return null;

    return (
      <Card elevation="sm" padding="md" style={headerStyle}>
        <View style={getProgressBarStyle()}>
          {steps.map((step, index) => (
            <React.Fragment key={step.id || index}>
              <TouchableOpacity
                onPress={() => handleStepPress(index)}
                disabled={!allowSkipSteps && index > activeStep}
                style={{ alignItems: 'center' }}
              >
                <View style={getStepIndicatorStyle(index)}>
                  {index < activeStep ? (
                    <Ionicons name="checkmark" size={18} color="#FFFFFF" />
                  ) : (
                    <Text style={{
                      ...theme.typography.labelMedium,
                      color: index <= activeStep ? '#FFFFFF' : theme.colors.textSecondary,
                    }}>
                      {index + 1}
                    </Text>
                  )}
                </View>
                <Text style={getStepTextStyle(index)} numberOfLines={2}>
                  {step.title}
                </Text>
              </TouchableOpacity>
              {index < totalSteps - 1 && (
                <View style={getStepConnectorStyle(index)} />
              )}
            </React.Fragment>
          ))}
        </View>
      </Card>
    );
  };

  const renderHeader = () => {
    const currentStepData = steps[activeStep];
    if (!currentStepData) return null;

    return (
      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.divider,
      }}>
        {activeStep > 0 && (
          <TouchableOpacity
            onPress={handlePrevious}
            style={{
              padding: theme.spacing.sm,
              marginRight: theme.spacing.md,
            }}
          >
            <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
          </TouchableOpacity>
        )}
        
        <View style={{ flex: 1 }}>
          <Text style={{
            ...theme.typography.headlineMedium,
            color: theme.colors.text,
          }}>
            {currentStepData.title}
          </Text>
          {currentStepData.subtitle && (
            <Text style={{
              ...theme.typography.bodyMedium,
              color: theme.colors.textSecondary,
              marginTop: theme.spacing.xs,
            }}>
              {currentStepData.subtitle}
            </Text>
          )}
        </View>

        {onCancel && (
          <TouchableOpacity
            onPress={onCancel}
            style={{
              padding: theme.spacing.sm,
              marginLeft: theme.spacing.md,
            }}
          >
            <Ionicons name="close" size={24} color={theme.colors.textSecondary} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderNavigationButtons = () => {
    const currentStepData = steps[activeStep];
    if (!currentStepData?.showNavigation) return null;

    return (
      <View style={{
        flexDirection: 'row',
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.lg,
        borderTopWidth: 1,
        borderTopColor: theme.colors.divider,
        backgroundColor: theme.colors.surface,
      }}>
        {activeStep > 0 && (
          <Button
            title="Previous"
            variant="outline"
            onPress={handlePrevious}
            style={{ flex: 1, marginRight: theme.spacing.sm }}
          />
        )}
        
        <Button
          title={activeStep === totalSteps - 1 ? 'Complete' : 'Next'}
          onPress={handleNext}
          disabled={currentStepData.isValid === false}
          style={{ flex: activeStep > 0 ? 1 : 2, marginLeft: activeStep > 0 ? theme.spacing.sm : 0 }}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={[{ flex: 1, backgroundColor: theme.colors.background }, style]} {...props}>
      {renderProgressBar()}
      {renderHeader()}
      
      <ScrollView
        style={[{ flex: 1 }, contentStyle]}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {React.Children.map(children, (child, index) => {
          if (index === activeStep) {
            return React.cloneElement(child, {
              onNext: handleNext,
              onPrevious: handlePrevious,
              isActive: true,
              stepIndex: activeStep,
              totalSteps,
            });
          }
          return null;
        })}
      </ScrollView>

      {renderNavigationButtons()}
    </SafeAreaView>
  );
};

// PropTypes for better development experience
BookingWizard.defaultProps = {
  steps: [],
  currentStep: 0,
  showProgress: true,
  allowSkipSteps: false,
};

export default BookingWizard;