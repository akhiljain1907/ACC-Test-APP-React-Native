/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Platform,
  useColorScheme,
} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { CampaignClassic } from "@adobe/react-native-aepcampaignclassic";

function App(): React.JSX.Element {
  const [fcmToken, setFcmToken] = useState<string>('');
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {

    const requestUserPermission = async () => {
      if (Platform.OS === 'android') {
        // On Android, permissions are granted by default
        getFCMToken();
      } else {
        const authStatus = await messaging().requestPermission();
        const enabled =
          authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
          authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
          getFCMToken();
        }
      }
    };

    const getFCMToken = async () => {
      try {
        const token = await messaging().getToken();
        console.log('FCM Token:', token);
        setFcmToken(token);
        CampaignClassic.registerDeviceWithToken(token, 'akhiljain.adobe.com');
        console.log('Device registered with Adobe Campaign (token: ' + token + ')');
      } catch (error) {
        console.error('Failed to get FCM token:', error);
      }
    };

    // Initialize Firebase Messaging
    requestUserPermission();

    // Listen for token refresh
    const unsubscribe = messaging().onTokenRefresh(token => {
      console.log('New FCM Token:', token);
      setFcmToken(token);
      CampaignClassic.registerDeviceWithToken(token, 'akhiljain.adobe.com');
      console.log('Device registered with Adobe Campaign (token: ' + token + ')');
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={[styles.container, isDarkMode && styles.darkContainer]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={isDarkMode ? '#000000' : '#FFFFFF'}
      />
      <View style={styles.content}>
        <Text style={[styles.title, isDarkMode && styles.darkText]}>Firebase Push Token</Text>
        <View style={[styles.tokenContainer, isDarkMode && styles.darkTokenContainer]}>
          <Text style={[styles.label, isDarkMode && styles.darkText]}>Device Token:</Text>
          <Text style={[styles.token, isDarkMode && styles.darkToken]}>
            {fcmToken || 'Waiting for token...'}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  darkContainer: {
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333333',
    textAlign: 'center',
    marginBottom: 30,
  },
  tokenContainer: {
    padding: 20,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkTokenContainer: {
    backgroundColor: '#1A1A1A',
  },
  label: {
    fontSize: 16,
    color: '#666666',
    marginBottom: 10,
    fontWeight: '500',
  },
  token: {
    fontSize: 14,
    color: '#333333',
    padding: 15,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    overflow: 'scroll',
  },
  darkText: {
    color: '#FFFFFF',
  },
  darkToken: {
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF',
  },
});

export default App;
