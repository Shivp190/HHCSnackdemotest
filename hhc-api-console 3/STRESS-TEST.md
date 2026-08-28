# STRESS-TEST

**1. Demo pill renders without layout shift on iOS, Android, web.**
`Screen` (in `theme/components.tsx`) renders the "Demo data" pill as a
`position: 'absolute'` overlay outside the `ScrollView`'s content flow, and
`MOCK_MODE` is a fixed `true` constant rather than a value that flips after
first render — so there is no conditional mount/unmount to cause a shift, on
any platform. The pill uses only plain `View`/`Text`/`StyleSheet`, no
platform-specific layout primitive.

**2. Edits survive sign-out/sign-in until Reset or reload.**
`mock/store.ts` exports a module-level singleton (`export const store = new
Store()`), instantiated once and held for the lifetime of the JS bundle.
Sign-out/sign-in only changes `AuthContext`'s token state (via `storage.ts`);
neither path touches `store.ts`. So table edits persist across auth cycles
and are only cleared by calling `store.reset()` (the "Reset demo data"
button) or a full reload of the Snack, which re-instantiates the module and
reseeds from `mock/seed.ts`.

**3. An `exp` in the past triggers the 401 path back to Landing.**
`mock/jwt.ts`'s `isExpired()` compares `payload.exp` (unix seconds) against
the current time. `mock/router.ts`'s `checkAuth()` calls it on every
`auth: true` route; an expired token returns 401 `{ info: "Unauthorized" }`.
`api/client.ts`'s `request()` sees status 401 on a call made with
`options.auth: true` and calls `onUnauthorizedFn()`, which `AuthContext`
wires to `setSession(null)` — clearing the in-memory token and
`storage.ts`. `RootNavigator` re-renders with `token === null` and swaps to
the Landing/Auth stack.

**4. `register` with `otp-only@…` succeeds once and 409s the second time.**
The seed ships a user row for `otp-only@healthandhopeclinic.org` with
`password: null` — simulating a prior `request-otp` call. The first
`register` call finds that row, has no existing credential, and claims it
(sets `password`, `first_name`, `last_name`), returning 201. The second
`register` call with the same email finds the same row, now with a
credential set, and returns 409
`{ info: "An account with this email already exists. Sign in instead." }`.

**5. No `Buffer`, `atob`, or other non-RN API in any code path.**
`mock/jwt.ts` (token minting/parsing) and `api/auth.ts` (client-side
decoding) each carry their own hand-written base64url codec over plain
number arrays, with a manual UTF-8 encoder/decoder — no `Buffer`, `atob`, or
`btoa`. Everything else in the project uses `JSON.stringify`/`parse`,
`Math.random`, `Date.now`, and `setTimeout`, all available in Hermes/RN.

**6. `package.json` matches Section 2 exactly.**
It did originally, using `"*"` for every dependency as specified. In
practice that let Snack resolve `@react-navigation/native-stack@7.18.10`,
published only two days before this was tested — its Snackager build wasn't
settled yet and failed to parse a Flow-typed file inside `react-native`
itself (`NativeReactNativeFeatureFlags.js`), unrelated to any code in this
project. The fix was to pin exact, slightly older (three-week-plus),
already-settled versions instead of `"*"`:

```json
{
  "name": "hhc-api-console",
  "version": "1.0.0",
  "main": "App.tsx",
  "dependencies": {
    "@react-navigation/native": "7.3.18",
    "@react-navigation/native-stack": "7.18.8",
    "expo-secure-store": "57.0.1",
    "expo-status-bar": "57.0.1",
    "react-native-safe-area-context": "5.8.1",
    "react-native-screens": "4.27.0"
  }
}
```

`app.json`'s `sdkVersion` was also bumped from the spec's placeholder
`52.0.0` to `57.0.0` — the SDK actually current at time of testing — since
Expo Go/Snack only support the current SDK. No extra dependencies were
added anywhere in the tree.

If a future `"*"` resolution regresses the same way (a newly-published
`@react-navigation/native-stack` patch outrunning Snackager's cache), the
fix is the same shape: pin to the previous patch, or use Snack's own
dependency-version picker, which only offers versions it has already
verified.
