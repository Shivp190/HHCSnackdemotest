import React, { useMemo, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { RootStackParamList } from '../navigation/RootNavigator';
import { Screen, Card, Button, TextField, MethodBadge, Notice, Mono } from '../theme/components';
import { color, space } from '../theme/tokens';
import { request, ApiError } from '../api/client';

type Props = NativeStackScreenProps<RootStackParamList, 'Endpoint'>;

interface SuccessState {
  status: number;
  ms: number;
  data: unknown;
  raw: string;
}
interface ErrorState {
  status: number;
  message: string;
  raw: string;
}

export default function EndpointScreen({ route }: Props) {
  const { endpoint } = route.params;
  const [params, setParams] = useState<Record<string, string>>({});
  const [bodyText, setBodyText] = useState(endpoint.bodyExample ? JSON.stringify(endpoint.bodyExample, null, 2) : '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SuccessState | null>(null);
  const [errorInfo, setErrorInfo] = useState<ErrorState | null>(null);
  const [view, setView] = useState<'formatted' | 'raw'>('formatted');

  const resolvedPath = useMemo(() => {
    let path = endpoint.path;
    for (const p of endpoint.params ?? []) {
      path = path.replace(`{${p.name}}`, params[p.name] ?? `{${p.name}}`);
    }
    return path;
  }, [endpoint, params]);

  async function handleSend() {
    setLoading(true);
    setResult(null);
    setErrorInfo(null);
    try {
      const res = await request(endpoint.method, resolvedPath, bodyText || undefined, { auth: endpoint.auth });
      setResult({ status: res.status, ms: res.ms, data: res.data, raw: res.raw });
    } catch (e) {
      if (e instanceof ApiError) {
        setErrorInfo({ status: e.status, message: e.message, raw: JSON.stringify(e.body, null, 2) });
      } else {
        setErrorInfo({ status: 0, message: 'Unexpected error.', raw: String(e) });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.wrap}>
        <View style={styles.topRow}>
          <MethodBadge method={endpoint.method} />
          <Mono style={styles.path}>{resolvedPath}</Mono>
        </View>

        {endpoint.phi ? (
          <Notice kind="warning" style={{ marginTop: space(2) }}>
            This route returns protected health information. Handle the response under the clinic's HIPAA policy.
          </Notice>
        ) : null}

        {(endpoint.params ?? []).map((p) => (
          <TextField
            key={p.name}
            label={`${p.name} (${p.type})`}
            value={params[p.name] ?? ''}
            onChangeText={(v) => setParams((prev) => ({ ...prev, [p.name]: v }))}
            keyboardType="number-pad"
          />
        ))}

        {endpoint.bodyExample !== undefined ? (
          <View style={{ marginTop: space(2) }}>
            <Text style={styles.label}>Request body</Text>
            <TextField value={bodyText} onChangeText={setBodyText} multiline mono style={{ minHeight: 160 }} />
          </View>
        ) : null}

        <Button
          title={`Send ${endpoint.method}`}
          onPress={handleSend}
          loading={loading}
          variant={endpoint.method === 'DELETE' ? 'danger' : 'primary'}
          style={{ marginTop: space(3) }}
        />

        {errorInfo ? (
          <View style={{ marginTop: space(3) }}>
            <Notice kind="error">HTTP {errorInfo.status} · {errorInfo.message}</Notice>
            <Mono style={styles.rawBlock}>{errorInfo.raw}</Mono>
          </View>
        ) : null}

        {result ? (
          <View style={{ marginTop: space(3) }}>
            <Notice kind="success">HTTP {result.status} · {result.ms} ms</Notice>
            <View style={styles.toggleRow}>
              <Button title="Formatted" variant={view === 'formatted' ? 'primary' : 'ghost'} onPress={() => setView('formatted')} style={styles.toggleButton} />
              <Button title="Raw" variant={view === 'raw' ? 'primary' : 'ghost'} onPress={() => setView('raw')} style={styles.toggleButton} />
            </View>
            <ScrollView style={styles.rawScroll} horizontal>
              <Mono style={styles.rawBlock}>{view === 'formatted' ? JSON.stringify(result.data, null, 2) : result.raw}</Mono>
            </ScrollView>
          </View>
        ) : null}
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  wrap: { padding: space(3), maxWidth: 640, width: '100%', alignSelf: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', marginTop: space(2) },
  path: { marginLeft: space(1), fontSize: 14, color: color.ink },
  label: { color: color.muted, fontWeight: '600', fontSize: 12, marginBottom: space(1) },
  rawBlock: { marginTop: space(1), padding: space(2), backgroundColor: color.mist, borderRadius: 10, fontSize: 12 },
  toggleRow: { flexDirection: 'row', marginTop: space(2) },
  toggleButton: { marginRight: space(1) },
  rawScroll: { marginTop: space(1) },
});
