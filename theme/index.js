const colors = {
  // Professional blue primary theme (like Uber/Lyft)
  primary: '#007AFF', // Professional blue
  primaryDark: '#005BB5',
  primaryLight: '#4DA2FF',
  
  // Secondary colors
  secondary: '#FF6B35', // Orange accent
  secondaryLight: '#FF8A5C',
  
  // Neutral colors
  background: '#FFFFFF',
  surface: '#FFFFFF',
  card: '#FFFFFF',
  
  // Text colors
  text: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  
  // Grays
  gray50: '#FAFAFA',
  gray100: '#F5F5F5',
  gray200: '#EEEEEE',
  gray300: '#E0E0E0',
  gray400: '#BDBDBD',
  gray500: '#9E9E9E',
  gray600: '#757575',
  gray700: '#616161',
  gray800: '#424242',
  gray900: '#212121',
  
  // Status colors - Enhanced for better accessibility
  success: '#10B981',
  successLight: '#34D399',
  successDark: '#059669',
  warning: '#F59E0B',
  warningLight: '#FBBF24',
  warningDark: '#D97706',
  error: '#EF4444',
  errorLight: '#F87171',
  errorDark: '#DC2626',
  info: '#3B82F6',
  infoLight: '#60A5FA',
  infoDark: '#2563EB',

  // Emergency colors - More prominent
  emergency: '#DC2626',
  emergencyDark: '#B91C1C',
  emergencyLight: '#EF4444',
  emergencyBackground: '#FEF2F2',
  
  // Shadows
  shadow: '#000000',
  
  // Map/Location
  mapPrimary: '#FFB800',
  mapSecondary: '#FF6B35',
  
  // Special states
  disabled: '#F5F5F5',
  disabledText: '#BDBDBD',
  border: '#E0E0E0',
  divider: '#EEEEEE',
  
  // Dark theme (optional)
  backgroundDark: '#121212',
  surfaceDark: '#1E1E1E',
  textDark: '#FFFFFF',
};

const typography = {
  // Display
  displayLarge: {
    fontSize: 32,
    fontWeight: '700',
    lineHeight: 40,
    letterSpacing: -0.5,
  },
  displayMedium: {
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 36,
    letterSpacing: -0.25,
  },
  displaySmall: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  
  // Headline
  headlineLarge: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  headlineMedium: {
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  headlineSmall: {
    fontSize: 16,
    fontWeight: '600',
    lineHeight: 22,
  },
  
  // Title
  titleLarge: {
    fontSize: 16,
    fontWeight: '500',
    lineHeight: 22,
  },
  titleMedium: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  titleSmall: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  
  // Body
  bodyLarge: {
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  bodyMedium: {
    fontSize: 14,
    fontWeight: '400',
    lineHeight: 20,
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: '400',
    lineHeight: 16,
  },
  
  // Label
  labelLarge: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  labelMedium: {
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
  },
  labelSmall: {
    fontSize: 10,
    fontWeight: '500',
    lineHeight: 14,
  },
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  round: 9999,
};

const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 5,
  },
  xl: {
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
};

const theme = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  
  // Navigation theme for React Navigation
  navigation: {
    dark: false,
    colors: {
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
      notification: colors.secondary,
    },
    fonts: {
      regular: {
        fontFamily: 'System',
        fontWeight: 'normal',
      },
      medium: {
        fontFamily: 'System',
        fontWeight: '500',
      },
      light: {
        fontFamily: 'System',
        fontWeight: '300',
      },
      thin: {
        fontFamily: 'System',
        fontWeight: '100',
      },
      bold: {
        fontFamily: 'System',
        fontWeight: 'bold',
      },
    },
  },
};

export default theme;