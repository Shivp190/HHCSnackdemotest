import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Screen, Logo, Card, Button, Notice } from '../theme/components';
import { color, space } from '../theme/tokens';

type Props = NativeStackScreenProps<RootStackParamList, 'Landing'>;

const STEPS = [
  { n: 1, title: 'Sign in', body: 'Use your clinic credentials or a one-time email code.' },
  { n: 2, title: 'Choose a service', body: 'Client, Caregiver, Provider, or Auth records.' },
  { n: 3, title: 'Read or update records', body: 'Send a request and watch the demo store change.' },
];

export default function LandingScreen({ navigation }: Props) {
  return (
    <Screen>
      <View style={styles.wrap}>
        <Logo />
        <Text style={styles.eyebrow}>FOR CLINIC STAFF AND VOLUNTEERS</Text>
        <Text style={styles.headline}>Direct access to the records that run the clinic.</Text>
        <Text style={styles.paragraph}>
          Client, caregiver, and provider data has been reachable only through a developer page.
          The clinic's technology team built this console so staff and volunteers can reach the
          same records directly, without waiting on someone else to run a query.
        </Text>

        <Card style={styles.stepCard}>
          {STEPS.map((s) => (
            <View key={s.n} style={styles.stepRow}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{s.n}</Text>
              </View>
              <View style={styles.stepText}>
                <Text style={styles.stepTitle}>{s.title}</Text>
                <Text style={styles.stepBody}>{s.body}</Text>
              </View>
            </View>
          ))}
        </Card>

        <Button title="Sign in" onPress={() => navigation.navigate('Auth', { initialTab: 'signin' })} style={{ marginTop: space(3) }} />
        <Button
          title="Create an account"
          variant="ghost"
          onPress={() => navigation.navigate('Auth', { initialTab: 'create' })}
          style={{ marginTop: space(1) }}
        />

        <Notice kind="muted" style={{ marginTop: space(4) }}>
          Without an account, records stay out of reach.
        </Notice>
        <Notice kind="success" style={{ marginTop: space(1) }}>
          With one, the clinic's day-to-day work moves faster.
        </Notice>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(3), maxWidth: 480, width: '100%', alignSelf: 'center' },
  eyebrow: { marginTop: space(4), color: color.hope, fontWeight: '700', letterSpacing: 1.5, fontSize: 12 },
  headline: { marginTop: space(1), color: color.ink, fontSize: 28, fontWeight: '700', lineHeight: 34 },
  paragraph: { marginTop: space(2), color: color.muted, fontSize: 15, lineHeight: 22 },
  stepCard: { marginTop: space(4) },
  stepRow: { flexDirection: 'row', marginBottom: space(2) },
  stepNumber: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: color.primary,
    alignItems: 'center', justifyContent: 'center', marginRight: space(2),
  },
  stepNumberText: { color: color.surface, fontWeight: '700' },
  stepText: { flex: 1 },
  stepTitle: { color: color.ink, fontWeight: '700', fontSize: 15 },
  stepBody: { color: color.muted, fontSize: 13, marginTop: 2 },
});
