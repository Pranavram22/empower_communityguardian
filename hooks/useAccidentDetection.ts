import { useState, useEffect, useRef } from 'react';
import { Platform } from 'react-native';
import { Accelerometer, Gyroscope } from 'expo-sensors';
import * as Location from 'expo-location';
import * as Device from 'expo-device';

const IMPACT_THRESHOLD = 20; // m/s²
const MOTION_INTERVAL = 100; // ms
const COUNTDOWN_DURATION = 30; // seconds

type AccidentDetectionState = {
  isMonitoring: boolean;
  lastImpact: number | null;
  countdownActive: boolean;
  countdown: number;
  location: { latitude: number; longitude: number } | null;
};

export function useAccidentDetection(onAccidentDetected: (location: { latitude: number; longitude: number }) => void) {
  const [state, setState] = useState<AccidentDetectionState>({
    isMonitoring: false,
    lastImpact: null,
    countdownActive: false,
    countdown: COUNTDOWN_DURATION,
    location: null,
  });

  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  const startMonitoring = async () => {
    if (Platform.OS === 'web') {
      console.warn('Accident detection is not available on web');
      return;
    }

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      console.error('Location permission denied');
      return;
    }

    setState(prev => ({ ...prev, isMonitoring: true }));
    
    // Start sensors
    Accelerometer.setUpdateInterval(MOTION_INTERVAL);
    Gyroscope.setUpdateInterval(MOTION_INTERVAL);

    // Subscribe to accelerometer
    Accelerometer.addListener(({ x, y, z }) => {
      const magnitude = Math.sqrt(x * x + y * y + z * z);
      
      if (magnitude > IMPACT_THRESHOLD) {
        handlePotentialAccident();
      }
    });
  };

  const stopMonitoring = () => {
    setState(prev => ({ ...prev, isMonitoring: false }));
    Accelerometer.removeAllListeners();
    Gyroscope.removeAllListeners();
  };

  const handlePotentialAccident = async () => {
    try {
      const location = await Location.getCurrentPositionAsync({});
      setState(prev => ({
        ...prev,
        lastImpact: Date.now(),
        countdownActive: true,
        countdown: COUNTDOWN_DURATION,
        location: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
      }));

      // Start countdown
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }

      countdownInterval.current = setInterval(() => {
        setState(prev => {
          if (prev.countdown <= 1) {
            clearInterval(countdownInterval.current!);
            if (prev.location) {
              onAccidentDetected(prev.location);
            }
            return {
              ...prev,
              countdownActive: false,
              countdown: COUNTDOWN_DURATION,
            };
          }
          return {
            ...prev,
            countdown: prev.countdown - 1,
          };
        });
      }, 1000);
    } catch (error) {
      console.error('Error handling potential accident:', error);
    }
  };

  const cancelCountdown = () => {
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    setState(prev => ({
      ...prev,
      countdownActive: false,
      countdown: COUNTDOWN_DURATION,
    }));
  };

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      if (countdownInterval.current) {
        clearInterval(countdownInterval.current);
      }
      stopMonitoring();
    };
  }, []);

  return {
    ...state,
    startMonitoring,
    stopMonitoring,
    cancelCountdown,
  };
}