import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Animated, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import theme from '../../theme';
import Card from '../ui/Card';
import Button from '../ui/Button';

const DriverRequest = ({
  bookingData,
  onDriverAssigned,
  onRequestCancel,
  onCallDriver,
  onMessageDriver,
  showDriverInfo = true,
  showETA = true,
  autoAssign = true,
  requestTimeout = 60000, // 60 seconds
  style,
  ...props
}) => {
  const [requestStatus, setRequestStatus] = useState('searching'); // 'searching', 'found', 'assigned', 'cancelled', 'timeout'
  const [assignedDriver, setAssignedDriver] = useState(null);
  const [searchProgress, setSearchProgress] = useState(0);
  const [remainingTime, setRemainingTime] = useState(requestTimeout / 1000);
  const [driverETA, setDriverETA] = useState(null);
  
  const progressAnimation = new Animated.Value(0);
  const pulseAnimation = new Animated.Value(1);

  // Mock driver data
  const mockDrivers = [
    {
      id: 'driver_001',
      name: 'James Mitchell',
      rating: 4.9,
      vehicleModel: 'BMW X5 Armored',
      vehiclePlate: 'GQ01 CPO',
      phoneNumber: '+44 7700 900123',
      photo: null,
      experience: '8 years',
      specializations: ['Executive Protection', 'Counter-surveillance'],
      location: {
        latitude: 51.5074,
        longitude: -0.1278,
      },
      eta: Math.floor(Math.random() * 10) + 5, // 5-15 minutes
      distance: '2.3 miles away',
      licenseNumber: 'SIA-12345678',
      isOnline: true,
      lastActive: new Date(),
    },
    {
      id: 'driver_002',
      name: 'Sarah Thompson',
      rating: 4.8,
      vehicleModel: 'Range Rover Sport',
      vehiclePlate: 'GQ02 SEC',
      phoneNumber: '+44 7700 900124',
      photo: null,
      experience: '6 years',
      specializations: ['Close Protection', 'Risk Assessment'],
      location: {
        latitude: 51.5155,
        longitude: -0.0922,
      },
      eta: Math.floor(Math.random() * 10) + 5,
      distance: '1.8 miles away',
      licenseNumber: 'SIA-87654321',
      isOnline: true,
      lastActive: new Date(),
    },
    {
      id: 'driver_003',
      name: 'Marcus Johnson',
      rating: 5.0,
      vehicleModel: 'Mercedes-Benz G-Wagon Armored',
      vehiclePlate: 'GQ03 VIP',
      phoneNumber: '+44 7700 900125',
      photo: null,
      experience: '12 years',
      specializations: ['VIP Protection', 'Threat Management', 'Secure Transport'],
      location: {
        latitude: 51.4994,
        longitude: -0.1319,
      },
      eta: Math.floor(Math.random() * 10) + 5,
      distance: '3.1 miles away',
      licenseNumber: 'SIA-11223344',
      isOnline: true,
      lastActive: new Date(),
    },
  ];

  const simulateDriverSearch = useCallback(async () => {
    setRequestStatus('searching');
    setSearchProgress(0);

    // Animate search progress
    Animated.timing(progressAnimation, {
      toValue: 1,
      duration: autoAssign ? 8000 : 15000, // Faster if auto-assign
      useNativeDriver: false,
    }).start();

    // Start pulse animation
    const pulse = () => {
      Animated.sequence([
        Animated.timing(pulseAnimation, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnimation, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        if (requestStatus === 'searching') {
          pulse();
        }
      });
    };
    pulse();

    // Simulate finding a driver
    setTimeout(() => {
      if (requestStatus === 'searching') {
        const selectedDriver = mockDrivers[Math.floor(Math.random() * mockDrivers.length)];
        setAssignedDriver(selectedDriver);
        setDriverETA(selectedDriver.eta);
        setRequestStatus('found');
        
        if (autoAssign) {
          setTimeout(() => {
            if (requestStatus !== 'cancelled') {
              setRequestStatus('assigned');
              if (onDriverAssigned) {
                onDriverAssigned(selectedDriver);
              }
            }
          }, 3000);
        }
      }
    }, autoAssign ? 3000 : 8000);
  }, [autoAssign, requestStatus, onDriverAssigned]);

  const handleAcceptDriver = useCallback(() => {
    if (assignedDriver) {
      setRequestStatus('assigned');
      if (onDriverAssigned) {
        onDriverAssigned(assignedDriver);
      }
    }
  }, [assignedDriver, onDriverAssigned]);

  const handleRejectDriver = useCallback(() => {
    setRequestStatus('searching');
    setAssignedDriver(null);
    setSearchProgress(0);
    simulateDriverSearch();
  }, [simulateDriverSearch]);

  const handleCancelRequest = useCallback(() => {
    setRequestStatus('cancelled');
    progressAnimation.stopAnimation();
    if (onRequestCancel) {
      onRequestCancel();
    }
  }, [onRequestCancel]);

  const handleCallDriver = useCallback(() => {
    if (assignedDriver && onCallDriver) {
      onCallDriver(assignedDriver);
    }
  }, [assignedDriver, onCallDriver]);

  const handleMessageDriver = useCallback(() => {
    if (assignedDriver && onMessageDriver) {
      onMessageDriver(assignedDriver);
    }
  }, [assignedDriver, onMessageDriver]);

  // Update search progress
  useEffect(() => {
    const progressListener = progressAnimation.addListener(({ value }) => {
      setSearchProgress(value * 100);
    });

    return () => {
      progressAnimation.removeListener(progressListener);
    };
  }, []);

  // Countdown timer
  useEffect(() => {
    if (requestStatus === 'searching' && remainingTime > 0) {
      const timer = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (remainingTime <= 0 && requestStatus === 'searching') {
      setRequestStatus('timeout');
    }
  }, [requestStatus, remainingTime]);

  // Start search on mount
  useEffect(() => {
    if (autoAssign) {
      simulateDriverSearch();
    }
  }, [autoAssign, simulateDriverSearch]);

  const renderSearchingState = () => (
    <Card padding="xl" style={{ alignItems: 'center' }}>
      <Animated.View
        style={{
          transform: [{ scale: pulseAnimation }],
          marginBottom: theme.spacing.lg,
        }}
      >
        <View style={{
          width: 80,
          height: 80,
          borderRadius: 40,
          backgroundColor: theme.colors.primary,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <ActivityIndicator size="large" color="#FFFFFF" />
        </View>
      </Animated.View>

      <Text style={{
        ...theme.typography.headlineMedium,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
      }}>
        Finding Your Driver
      </Text>

      <Text style={{
        ...theme.typography.bodyMedium,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
      }}>
        We're matching you with the best available SIA licensed officer in your area
      </Text>

      <View style={{
        width: '100%',
        height: 4,
        backgroundColor: theme.colors.gray200,
        borderRadius: 2,
        marginBottom: theme.spacing.md,
      }}>
        <View style={{
          width: `${searchProgress}%`,
          height: '100%',
          backgroundColor: theme.colors.primary,
          borderRadius: 2,
        }} />
      </View>

      <Text style={{
        ...theme.typography.bodySmall,
        color: theme.colors.textSecondary,
        marginBottom: theme.spacing.lg,
      }}>
        {Math.ceil(remainingTime)}s remaining
      </Text>

      <Button
        title="Cancel Request"
        variant="outline"
        onPress={handleCancelRequest}
        style={{ width: '60%' }}
      />
    </Card>
  );

  const renderDriverFound = () => {
    if (!assignedDriver) return null;

    return (
      <Card padding="lg">
        <View style={{
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
        }}>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 32,
            backgroundColor: theme.colors.success,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: theme.spacing.md,
          }}>
            <Ionicons name="checkmark" size={32} color="#FFFFFF" />
          </View>

          <Text style={{
            ...theme.typography.headlineMedium,
            color: theme.colors.text,
            textAlign: 'center',
          }}>
            Driver Found!
          </Text>
        </View>

        {showDriverInfo && (
          <View style={{
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.gray50,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.lg,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <View style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: theme.colors.gray300,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                {assignedDriver.photo ? (
                  <Image source={assignedDriver.photo} style={{ width: 48, height: 48, borderRadius: 24 }} />
                ) : (
                  <Ionicons name="person" size={24} color={theme.colors.textSecondary} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  ...theme.typography.headlineSmall,
                  color: theme.colors.text,
                }}>
                  {assignedDriver.name}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: theme.spacing.xs,
                }}>
                  <Ionicons name="star" size={14} color={theme.colors.warning} />
                  <Text style={{
                    ...theme.typography.bodySmall,
                    color: theme.colors.textSecondary,
                    marginLeft: theme.spacing.xs,
                  }}>
                    {assignedDriver.rating} • {assignedDriver.experience} experience
                  </Text>
                </View>
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.sm,
            }}>
              <Text style={{
                ...theme.typography.bodyMedium,
                color: theme.colors.text,
              }}>
                {assignedDriver.vehicleModel}
              </Text>
              <Text style={{
                ...theme.typography.bodyMedium,
                color: theme.colors.textSecondary,
              }}>
                {assignedDriver.vehiclePlate}
              </Text>
            </View>

            {showETA && driverETA && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing.sm,
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.sm,
              }}>
                <Ionicons name="time" size={16} color="#FFFFFF" />
                <Text style={{
                  ...theme.typography.labelMedium,
                  color: '#FFFFFF',
                  marginLeft: theme.spacing.sm,
                }}>
                  Arriving in {driverETA} minutes
                </Text>
              </View>
            )}
          </View>
        )}

        {!autoAssign && (
          <View style={{
            flexDirection: 'row',
            gap: theme.spacing.md,
          }}>
            <Button
              title="Accept"
              onPress={handleAcceptDriver}
              style={{ flex: 1 }}
            />
            <Button
              title="Find Another"
              variant="outline"
              onPress={handleRejectDriver}
              style={{ flex: 1 }}
            />
          </View>
        )}
      </Card>
    );
  };

  const renderDriverAssigned = () => {
    if (!assignedDriver) return null;

    return (
      <Card padding="lg">
        <View style={{
          alignItems: 'center',
          marginBottom: theme.spacing.lg,
        }}>
          <Text style={{
            ...theme.typography.headlineLarge,
            color: theme.colors.text,
            textAlign: 'center',
          }}>
            Your Driver is On The Way
          </Text>
        </View>

        {showDriverInfo && (
          <View style={{
            padding: theme.spacing.lg,
            backgroundColor: theme.colors.gray50,
            borderRadius: theme.borderRadius.md,
            marginBottom: theme.spacing.lg,
          }}>
            <View style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: theme.spacing.md,
            }}>
              <View style={{
                width: 56,
                height: 56,
                borderRadius: 28,
                backgroundColor: theme.colors.gray300,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: theme.spacing.md,
              }}>
                {assignedDriver.photo ? (
                  <Image source={assignedDriver.photo} style={{ width: 56, height: 56, borderRadius: 28 }} />
                ) : (
                  <Ionicons name="person" size={28} color={theme.colors.textSecondary} />
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={{
                  ...theme.typography.headlineMedium,
                  color: theme.colors.text,
                }}>
                  {assignedDriver.name}
                </Text>
                <View style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: theme.spacing.xs,
                }}>
                  <Ionicons name="star" size={16} color={theme.colors.warning} />
                  <Text style={{
                    ...theme.typography.bodyMedium,
                    color: theme.colors.textSecondary,
                    marginLeft: theme.spacing.xs,
                  }}>
                    {assignedDriver.rating} • SIA Licensed
                  </Text>
                </View>
              </View>
            </View>

            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: theme.spacing.md,
            }}>
              <View>
                <Text style={{
                  ...theme.typography.labelMedium,
                  color: theme.colors.textSecondary,
                }}>
                  Vehicle
                </Text>
                <Text style={{
                  ...theme.typography.bodyMedium,
                  color: theme.colors.text,
                }}>
                  {assignedDriver.vehicleModel}
                </Text>
              </View>
              <View>
                <Text style={{
                  ...theme.typography.labelMedium,
                  color: theme.colors.textSecondary,
                }}>
                  License Plate
                </Text>
                <Text style={{
                  ...theme.typography.bodyMedium,
                  color: theme.colors.text,
                }}>
                  {assignedDriver.vehiclePlate}
                </Text>
              </View>
            </View>

            {showETA && driverETA && (
              <View style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                padding: theme.spacing.md,
                backgroundColor: theme.colors.primary,
                borderRadius: theme.borderRadius.sm,
                marginBottom: theme.spacing.md,
              }}>
                <Ionicons name="time" size={20} color="#FFFFFF" />
                <Text style={{
                  ...theme.typography.headlineSmall,
                  color: '#FFFFFF',
                  marginLeft: theme.spacing.sm,
                }}>
                  {driverETA} minutes away
                </Text>
              </View>
            )}

            <View style={{
              flexDirection: 'row',
              gap: theme.spacing.md,
            }}>
              <Button
                title="Call Driver"
                variant="outline"
                onPress={handleCallDriver}
                style={{ flex: 1 }}
                leftIcon="call"
              />
              <Button
                title="Message"
                variant="outline"
                onPress={handleMessageDriver}
                style={{ flex: 1 }}
                leftIcon="chatbubble"
              />
            </View>
          </View>
        )}
      </Card>
    );
  };

  const renderTimeoutState = () => (
    <Card padding="xl" style={{ alignItems: 'center' }}>
      <View style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.warning,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
      }}>
        <Ionicons name="time" size={32} color="#FFFFFF" />
      </View>

      <Text style={{
        ...theme.typography.headlineMedium,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
      }}>
        Request Timed Out
      </Text>

      <Text style={{
        ...theme.typography.bodyMedium,
        color: theme.colors.textSecondary,
        textAlign: 'center',
        marginBottom: theme.spacing.lg,
      }}>
        We couldn't find a driver in time. Please try again or adjust your pickup location.
      </Text>

      <View style={{
        flexDirection: 'row',
        gap: theme.spacing.md,
        width: '100%',
      }}>
        <Button
          title="Try Again"
          onPress={() => {
            setRequestStatus('searching');
            setRemainingTime(requestTimeout / 1000);
            simulateDriverSearch();
          }}
          style={{ flex: 1 }}
        />
        <Button
          title="Cancel"
          variant="outline"
          onPress={handleCancelRequest}
          style={{ flex: 1 }}
        />
      </View>
    </Card>
  );

  const renderCancelledState = () => (
    <Card padding="xl" style={{ alignItems: 'center' }}>
      <View style={{
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: theme.colors.error,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: theme.spacing.lg,
      }}>
        <Ionicons name="close" size={32} color="#FFFFFF" />
      </View>

      <Text style={{
        ...theme.typography.headlineMedium,
        color: theme.colors.text,
        textAlign: 'center',
        marginBottom: theme.spacing.sm,
      }}>
        Request Cancelled
      </Text>

      <Text style={{
        ...theme.typography.bodyMedium,
        color: theme.colors.textSecondary,
        textAlign: 'center',
      }}>
        Your driver request has been cancelled.
      </Text>
    </Card>
  );

  return (
    <View style={[{ flex: 1, justifyContent: 'center', padding: theme.spacing.md }, style]} {...props}>
      {requestStatus === 'searching' && renderSearchingState()}
      {requestStatus === 'found' && renderDriverFound()}
      {requestStatus === 'assigned' && renderDriverAssigned()}
      {requestStatus === 'timeout' && renderTimeoutState()}
      {requestStatus === 'cancelled' && renderCancelledState()}
    </View>
  );
};

export default DriverRequest;