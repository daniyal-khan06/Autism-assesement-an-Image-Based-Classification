import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, AppState } from 'react-native';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import IntroScreen from './src/screens/IntroScrn';
import IntroScreen2 from './src/screens/introScrn2';
import IntroScreen3 from './src/screens/introScrn3';
import Dashboard from './src/screens/dashboard';
import AQ_10 from './src/screens/AQ_10';
import ScanScreen from './src/screens/ScanScreen';
import ADHD from './src/screens/ADHD';
import SignInScreen from './src/screens/SignInScreen';
import SignUpScreen from './src/screens/SignUpScreen';

// Optionally for Firebase Auth check
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './src/config/firebaseConfig';

function App() {
  const Stack = createNativeStackNavigator();
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);
  const activeTime = useRef(0);
  const backgroundTime = useRef(0);
  const hold = useRef(0);
  const [initialRoute, setInitialRoute] = useState('Signin'); // default

  // App background/foreground tracking
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        console.log('App has come to the foreground!');
        activeTime.current = new Date().getMinutes();
      }

      if (
        (appState.current.match(/active/) && nextAppState === 'inactive') ||
        nextAppState === 'background'
      ) {
        backgroundTime.current = new Date().getMinutes();
        hold.current = activeTime.current - backgroundTime.current;
        console.log('App has gone to the background!', hold.current);
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Firebase auth auto-login check
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        setInitialRoute('Dashboard');
      } else {
        setInitialRoute('Signin');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={initialRoute}
        screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={IntroScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Details" component={IntroScreen2} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Screen3" component={IntroScreen3} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Signin" component={SignInScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Signup" component={SignUpScreen} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Dashboard" component={Dashboard} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="AQ_10" component={AQ_10} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="ADHD" component={ADHD} options={{ animation: 'slide_from_right' }} />
        <Stack.Screen name="Scan" component={ScanScreen} options={{ animation: 'slide_from_right' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  page: {
    width: '100%',
    height: '100%',
  },
});
export default App;
