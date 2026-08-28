import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import LandingScreen from '../screens/LandingScreen';
import AuthScreen from '../screens/AuthScreen';
import ConsoleHomeScreen from '../screens/ConsoleHomeScreen';
import EndpointScreen from '../screens/EndpointScreen';
import type { Endpoint } from '../api/endpoints';

export type RootStackParamList = {
  Landing: undefined;
  Auth: { initialTab?: 'signin' | 'create' } | undefined;
  ConsoleHome: undefined;
  Endpoint: { endpoint: Endpoint };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function RootNavigator() {
  const { token, ready } = useAuth();

  if (!ready) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="ConsoleHome" component={ConsoleHomeScreen} />
            <Stack.Screen name="Endpoint" component={EndpointScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Landing" component={LandingScreen} />
            <Stack.Screen name="Auth" component={AuthScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
