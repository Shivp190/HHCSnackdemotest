import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const KEY = 'hhc_console_token';
let memoryToken: string | null = null;

export async function getStoredToken(): Promise<string | null> {
  if (Platform.OS === 'web') return memoryToken;
  try {
    return await SecureStore.getItemAsync(KEY);
  } catch {
    return null;
  }
}

export async function setStoredToken(token: string | null): Promise<void> {
  if (Platform.OS === 'web') {
    memoryToken = token;
    return;
  }
  try {
    if (token) {
      await SecureStore.setItemAsync(KEY, token);
    } else {
      await SecureStore.deleteItemAsync(KEY);
    }
  } catch {
    // Demo mode: storage failures should never block sign-in/out.
  }
}
