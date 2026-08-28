import React from 'react';
import {
  View, Text, TextInput, Pressable, ActivityIndicator, StyleSheet,
  ScrollView, SafeAreaView, Image, ViewStyle, StyleProp, TextInputProps, TextStyle,
} from 'react-native';
import { color, font, space, radius, LOGO_URL, MOCK_MODE } from './tokens';
import type { Method } from '../api/endpoints';

// ---------- Screen ----------
// The "Demo data" pill is rendered as an absolutely-positioned overlay outside
// the scroll flow, and MOCK_MODE is a fixed constant, so it never causes a
// layout shift on any platform.
export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.screenScroll}>{children}</ScrollView>
      {MOCK_MODE ? (
        <View pointerEvents="none" style={styles.demoPill}>
          <Text style={styles.demoPillText}>Demo data</Text>
        </View>
      ) : null}
    </SafeAreaView>
  );
}

// ---------- Logo ----------
export function Logo() {
  if (LOGO_URL) {
    return <Image source={{ uri: LOGO_URL }} style={styles.logoImage} resizeMode="contain" />;
  }
  return (
    <View>
      <Text style={styles.wordmark}>
        HEALTH <Text style={{ color: color.hope }}>&</Text> HOPE
      </Text>
      <Text style={styles.wordmarkSub}>CLINIC · PENSACOLA</Text>
    </View>
  );
}

// ---------- Button ----------
type ButtonVariant = 'primary' | 'ghost' | 'danger';

export function Button({
  title, onPress, variant = 'primary', loading = false, disabled = false, style,
}: {
  title: string; onPress: () => void; variant?: ButtonVariant; loading?: boolean; disabled?: boolean; style?: StyleProp<ViewStyle>;
}) {
  const isDisabled = disabled || loading;
  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        variant === 'primary' ? styles.buttonPrimary : null,
        variant === 'ghost' ? styles.buttonGhost : null,
        variant === 'danger' ? styles.buttonDanger : null,
        isDisabled ? styles.buttonDisabled : null,
        pressed && !isDisabled ? styles.buttonPressed : null,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'ghost' ? color.primary : color.surface} />
      ) : (
        <Text style={[styles.buttonText, variant === 'ghost' ? styles.buttonTextGhost : styles.buttonTextSolid]}>
          {title}
        </Text>
      )}
    </Pressable>
  );
}

// ---------- TextField ----------
interface TextFieldProps extends TextInputProps {
  label?: string;
  mono?: boolean;
  error?: string;
  style?: StyleProp<ViewStyle>;
}

export function TextField({ label, mono, error, style, ...inputProps }: TextFieldProps) {
  return (
    <View style={[styles.fieldWrap, style]}>
      {label ? <Text style={styles.fieldLabel}>{label}</Text> : null}
      <TextInput
        placeholderTextColor={color.muted}
        style={[
          styles.fieldInput,
          mono ? styles.fieldInputMono : null,
          inputProps.multiline ? styles.fieldInputMultiline : null,
          error ? styles.fieldInputError : null,
        ]}
        {...inputProps}
      />
      {error ? <Text style={styles.fieldError}>{error}</Text> : null}
    </View>
  );
}

// ---------- Card ----------
export function Card({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ---------- MethodBadge ----------
const METHOD_COLOR: Record<Method, string> = {
  GET: color.get, POST: color.post, PUT: color.put, DELETE: color.del,
};

export function MethodBadge({ method }: { method: Method }) {
  return (
    <View style={[styles.methodBadge, { backgroundColor: METHOD_COLOR[method] }]}>
      <Text style={styles.methodBadgeText}>{method}</Text>
    </View>
  );
}

// ---------- Notice ----------
type NoticeKind = 'muted' | 'success' | 'error' | 'warning';

const NOTICE_COLOR: Record<NoticeKind, { bg: string; text: string; border: string }> = {
  muted: { bg: color.mist, text: color.muted, border: color.line },
  success: { bg: '#EAF6EE', text: color.ok, border: color.ok },
  error: { bg: '#FBEAE9', text: color.danger, border: color.danger },
  warning: { bg: '#FCF2E1', text: color.put, border: color.hope },
};

export function Notice({
  kind = 'muted', children, style,
}: { kind?: NoticeKind; children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const palette = NOTICE_COLOR[kind];
  return (
    <View style={[styles.notice, { backgroundColor: palette.bg, borderColor: palette.border }, style]}>
      <Text style={[styles.noticeText, { color: palette.text }]}>{children}</Text>
    </View>
  );
}

// ---------- Mono ----------
export function Mono({ children, style }: { children: React.ReactNode; style?: StyleProp<TextStyle> }) {
  return <Text style={[styles.mono, style]}>{children}</Text>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.mist },
  screenScroll: { flexGrow: 1, paddingBottom: space(6) },
  demoPill: {
    position: 'absolute', top: space(2), right: space(2),
    backgroundColor: color.primaryDeep, borderRadius: radius.lg,
    paddingHorizontal: space(1.5), paddingVertical: 4,
  },
  demoPillText: { color: color.hope, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },

  logoImage: { width: 160, height: 40 },
  wordmark: { color: color.primary, fontSize: 18, fontWeight: '800', letterSpacing: 0.5 },
  wordmarkSub: { color: color.muted, fontSize: 10, letterSpacing: 2, marginTop: 2 },

  button: { borderRadius: radius.md, paddingVertical: space(1.5), alignItems: 'center', justifyContent: 'center' },
  buttonPrimary: { backgroundColor: color.primary },
  buttonGhost: { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.line },
  buttonDanger: { backgroundColor: color.danger },
  buttonDisabled: { opacity: 0.6 },
  buttonPressed: { opacity: 0.85 },
  buttonText: { fontWeight: '700', fontSize: 15 },
  buttonTextSolid: { color: color.surface },
  buttonTextGhost: { color: color.primary },

  fieldWrap: { marginTop: space(2) },
  fieldLabel: { color: color.muted, fontSize: 12, fontWeight: '600', marginBottom: space(0.5) },
  fieldInput: {
    borderWidth: 1, borderColor: color.line, borderRadius: radius.sm,
    paddingHorizontal: space(1.5), paddingVertical: space(1.25),
    color: color.ink, fontSize: 15, backgroundColor: color.surface,
  },
  fieldInputMono: { fontFamily: font.mono, fontSize: 13 },
  fieldInputMultiline: { minHeight: 120, textAlignVertical: 'top' },
  fieldInputError: { borderColor: color.danger },
  fieldError: { color: color.danger, fontSize: 12, marginTop: 4 },

  card: { backgroundColor: color.surface, borderRadius: radius.md, borderWidth: 1, borderColor: color.line, padding: space(2) },

  methodBadge: { borderRadius: radius.sm, paddingHorizontal: space(1), paddingVertical: 2 },
  methodBadgeText: { color: color.surface, fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },

  notice: { borderWidth: 1, borderRadius: radius.sm, padding: space(1.5) },
  noticeText: { fontSize: 13, lineHeight: 18 },

  mono: { fontFamily: font.mono, fontSize: 13, color: color.ink },
});
