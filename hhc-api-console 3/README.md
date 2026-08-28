# HHC API Console — Demo (mocked edition)

A faithful stand-in for Health and Hope Clinic's C# Web API console. Every
HTTP call is answered by an in-memory mock in `mock/router.ts` — no network,
no server, no database. It runs as-is inside an Expo Snack.

## Loading it into Snack

1. Go to https://snack.expo.dev, create a new Snack, and delete the default files.
2. Paste each file in this project at the matching path (folders included).
3. Snack installs `@react-navigation/native`, `@react-navigation/native-stack`,
   `expo-secure-store`, `expo-status-bar`, `react-native-safe-area-context`,
   and `react-native-screens` automatically from `package.json`.

Or push this folder to a public repo and open:
`https://snack.expo.dev/@git/github.com/<owner>/<repo>:<folder>`

`package.json` pins exact dependency versions rather than `"*"` — the spec's
original `"*"` pulled in a `@react-navigation/native-stack` patch that was
two days old and not yet fully built by Snack's bundler, which crashed on
an internal React Native file. See STRESS-TEST.md, item 6, for the story
and what to do if a future `"*"` resolution regresses the same way.

## What's mocked vs. real

- `api/types.ts` and `api/endpoints.ts` are the real wire contract, copied
  from `AIS.WebApi`.
- `api/client.ts` calls `mock/router.ts` instead of `fetch`. Swapping that one
  file for a real `fetch`-based implementation is the only change needed to
  point this console at a live backend — everything above it (`api/auth.ts`,
  `api/clients.ts`, `api/caregivers.ts`, `api/providers.ts`, the screens) is
  unchanged.
- Tokens are unsigned, JWT-shaped strings (`header.payload.mock`) minted by
  `mock/jwt.ts`, decoded client-side by `api/auth.ts`'s `decodeJwt`. Neither
  uses `Buffer` or `atob`.

## Demo script

- Sign in: `demo@healthandhopeclinic.org` / `HopeDemo2026` (Password tab), or
  use the Email code tab with any email — the demo OTP is always `123456`.
- Add → edit → delete on Caregiver: open **Caregiver › POST api/caregiver/add**,
  send the pre-filled body to create a new row; open **Caregiver ›
  api/caregiver/list** to see it appear; open **PUT
  api/caregiver/{id}/edit** with that new id to change a field; open
  **DELETE api/caregiver/{id}/delete** with the same id; reopen
  **api/caregiver/list** to see it gone.
- "Reset demo data" on the console home screen restores the original seed at
  any time.
