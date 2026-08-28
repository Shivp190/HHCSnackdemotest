import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Screen, Card, Button, MethodBadge, Notice, Mono } from '../theme/components';
import { color, space, radius } from '../theme/tokens';
import { ENDPOINTS, Endpoint } from '../api/endpoints';
import { useAuth } from '../context/AuthContext';
import { store } from '../mock/store';

type Props = NativeStackScreenProps<RootStackParamList, 'ConsoleHome'>;

const TAGS: Endpoint['tag'][] = ['Client', 'Caregiver', 'Provider', 'Auth'];

export default function ConsoleHomeScreen({ navigation }: Props) {
  const { role, expiresAt, logout } = useAuth();
  const [resetNotice, setResetNotice] = useState(false);

  const minutesLeft = expiresAt ? Math.max(0, Math.round((expiresAt - Date.now()) / 60000)) : 0;

  const grouped = useMemo(() => {
    const map: Record<string, Endpoint[]> = {};
    for (const tag of TAGS) map[tag] = ENDPOINTS.filter((e) => e.tag === tag);
    return map;
  }, []);

  function handleReset() {
    store.reset();
    setResetNotice(true);
    setTimeout(() => setResetNotice(false), 2500);
  }

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>
          Signed in as {role ?? 'User'} · session ends in {minutesLeft} min
        </Text>
        <Pressable onPress={logout}>
          <Text style={styles.signOut}>Sign out</Text>
        </Pressable>
      </View>

      <View style={styles.toolRow}>
        <Button title="Reset demo data" variant="ghost" onPress={handleReset} />
        {resetNotice ? (
          <Notice kind="success" style={{ marginLeft: space(2), flex: 1 }}>
            Demo data restored.
          </Notice>
        ) : null}
      </View>

      {TAGS.map((tag) => (
        <View key={tag} style={styles.section}>
          <Text style={styles.sectionTitle}>{tag}</Text>
          {grouped[tag].map((endpoint) => (
            <Pressable key={`${endpoint.method} ${endpoint.path}`} onPress={() => navigation.navigate('Endpoint', { endpoint })}>
              <Card style={styles.routeCard}>
                <View style={styles.routeTop}>
                  <MethodBadge method={endpoint.method} />
                  {endpoint.auth ? <Chip label="LOCK" /> : null}
                  {endpoint.phi ? <Chip label="PHI" tone="danger" /> : null}
                </View>
                <Mono style={styles.routePath}>{endpoint.path}</Mono>
                {endpoint.note ? <Text style={styles.routeNote}>{endpoint.note}</Text> : null}
              </Card>
            </Pressable>
          ))}
        </View>
      ))}

      <Notice kind="muted" style={{ margin: space(3) }}>
        Records marked PHI are protected health information. Handle them under the clinic's HIPAA policy.
      </Notice>
    </Screen>
  );
}

function Chip({ label, tone = 'default' }: { label: string; tone?: 'default' | 'danger' }) {
  return (
    <View style={[styles.chip, tone === 'danger' ? styles.chipDanger : null]}>
      <Text style={[styles.chipText, tone === 'danger' ? styles.chipTextDanger : null]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: space(3), paddingTop: space(5) },
  headerTitle: { color: color.ink, fontWeight: '600', fontSize: 14, flex: 1, marginRight: space(2) },
  signOut: { color: color.primary, fontWeight: '700' },
  toolRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: space(3), marginBottom: space(2) },
  section: { paddingHorizontal: space(3), marginBottom: space(2) },
  sectionTitle: { color: color.muted, fontWeight: '700', fontSize: 12, letterSpacing: 1, marginBottom: space(1) },
  routeCard: { marginBottom: space(1) },
  routeTop: { flexDirection: 'row', alignItems: 'center' },
  routePath: { marginTop: space(1), fontSize: 13, color: color.ink },
  routeNote: { marginTop: 2, fontSize: 12, color: color.muted },
  chip: { borderWidth: 1, borderColor: color.line, borderRadius: radius.sm, paddingHorizontal: 6, paddingVertical: 2, marginLeft: space(1) },
  chipDanger: { borderColor: color.danger },
  chipText: { fontSize: 10, fontWeight: '700', color: color.muted, letterSpacing: 0.5 },
  chipTextDanger: { color: color.danger },
});
