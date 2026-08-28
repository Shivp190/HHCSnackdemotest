import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Screen, Card, Button, TextField, Notice, Logo } from '../theme/components';
import { space } from '../theme/tokens';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Auth'>;

type Tab = 'signin' | 'create';
type SignInMode = 'password' | 'otp';

export default function AuthScreen({ route }: Props) {
  const [tab, setTab] = useState<Tab>(route.params?.initialTab ?? 'signin');

  return (
    <Screen>
      <View style={styles.wrap}>
        <Logo />
        <View style={styles.tabRow}>
          <Button title="Sign in" variant={tab === 'signin' ? 'primary' : 'ghost'} onPress={() => setTab('signin')} style={styles.tabButton} />
          <Button title="Create account" variant={tab === 'create' ? 'primary' : 'ghost'} onPress={() => setTab('create')} style={styles.tabButton} />
        </View>
        <Card>{tab === 'signin' ? <SignInPanel /> : <CreateAccountPanel />}</Card>
      </View>
    </Screen>
  );
}

function SignInPanel() {
  const { login, requestOtp, verifyOtp } = useAuth();
  const [mode, setMode] = useState<SignInMode>('password');
  const [username, setUsername] = useState('demo@healthandhopeclinic.org');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handlePasswordSignIn() {
    setError(null);
    setLoading(true);
    try {
      await login(username, password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Sign in failed.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRequestOtp() {
    setError(null);
    setLoading(true);
    try {
      await requestOtp(email);
      setOtpSent(true);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not send a code.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp() {
    setError(null);
    setLoading(true);
    try {
      await verifyOtp(email, otp);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not verify the code.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <View style={styles.segmentRow}>
        <Button title="Password" variant={mode === 'password' ? 'primary' : 'ghost'} onPress={() => setMode('password')} style={styles.segmentButton} />
        <Button title="Email code" variant={mode === 'otp' ? 'primary' : 'ghost'} onPress={() => setMode('otp')} style={styles.segmentButton} />
      </View>

      {mode === 'password' ? (
        <View>
          <TextField label="Username (email)" value={username} onChangeText={setUsername} autoCapitalize="none" keyboardType="email-address" />
          <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
          {error ? <Notice kind="error" style={{ marginTop: space(2) }}>{error}</Notice> : null}
          <Button title="Sign in" onPress={handlePasswordSignIn} loading={loading} style={{ marginTop: space(2) }} />
        </View>
      ) : (
        <View>
          <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" editable={!otpSent} />
          {otpSent ? (
            <>
              <Notice kind="muted" style={{ marginTop: space(2) }}>Demo code: 123456 (expires in 10 minutes)</Notice>
              <TextField label="Six-digit code" value={otp} onChangeText={setOtp} keyboardType="number-pad" maxLength={6} />
              {error ? <Notice kind="error" style={{ marginTop: space(2) }}>{error}</Notice> : null}
              <Button title="Verify code" onPress={handleVerifyOtp} loading={loading} style={{ marginTop: space(2) }} />
            </>
          ) : (
            <>
              {error ? <Notice kind="error" style={{ marginTop: space(2) }}>{error}</Notice> : null}
              <Button title="Send code" onPress={handleRequestOtp} loading={loading} style={{ marginTop: space(2) }} />
            </>
          )}
        </View>
      )}
    </View>
  );
}

function CreateAccountPanel() {
  const { signup } = useAuth();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validate(): string | null {
    if (!firstName.trim() || !lastName.trim() || !email.trim() || !password) return 'All fields are required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Enter a valid email address.';
    if (password.length < 8) return 'Password must be at least 8 characters.';
    if (password !== confirm) return 'Passwords do not match.';
    return null;
  }

  async function handleSubmit() {
    const localError = validate();
    if (localError) {
      setError(localError);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await signup(firstName, lastName, email, password);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : 'Could not create the account.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View>
      <TextField label="First name" value={firstName} onChangeText={setFirstName} />
      <TextField label="Last name" value={lastName} onChangeText={setLastName} />
      <TextField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      <TextField label="Confirm password" value={confirm} onChangeText={setConfirm} secureTextEntry />
      {error ? <Notice kind="error" style={{ marginTop: space(2) }}>{error}</Notice> : null}
      <Button title="Create account" onPress={handleSubmit} loading={loading} style={{ marginTop: space(2) }} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(3), maxWidth: 480, width: '100%', alignSelf: 'center' },
  tabRow: { flexDirection: 'row', marginTop: space(3), marginBottom: space(2) },
  tabButton: { flex: 1, marginRight: space(1) },
  segmentRow: { flexDirection: 'row', marginBottom: space(2) },
  segmentButton: { flex: 1, marginRight: space(1) },
});
