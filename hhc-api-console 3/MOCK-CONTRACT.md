# MOCK-CONTRACT

One row per route. "Request body" is `none` where the method takes no body.
Every status a route can return is listed with its `info` string (or shape,
for 200/201 bodies that aren't `{ info }`). Rows marked * document an error
the embedded spec left open-ended (missing field / bad email / short
password text, and the volunteer-duplicate message); the router picks a
concrete wording, given here.

## Auth

| Method | Path | Auth | Request body | Success | Errors |
|---|---|---|---|---|---|
| GET | `api/auth/start` | No | none | 200 — string `"HHC API Console mock is online."` | — |
| POST | `api/auth/generate/token` | No | `{ username, password }` | 200 `{ access_token, help_info }`, role `Admin` | 401 `{ info: "You are not a valid user so token generation failed." }` |
| POST | `api/auth/login/request-otp` | No | `{ email }` | 200 `{ info: "OTP sent" }`; code is always `123456`, valid 10 min; creates the user row (no credential) if absent | 400 `{ info: "A valid email is required." }`* |
| POST | `api/auth/login/verify-otp` | No | `{ email, otp }` | 200 `{ accessToken, info: "OTP verified successfully." }`, role `User` | 401 `{ info: "Invalid or expired OTP." }` |
| POST | `api/auth/register` | No | `{ first_name, last_name, email, password }` | 201 `{ access_token, help_info: "Account created." }`, role `User`; claims an existing no-credential row | 400 `{ info: "<field> is required." }`*, 400 `{ info: "A valid email is required." }`*, 400 `{ info: "Password must be at least 8 characters." }`, 409 `{ info: "An account with this email already exists. Sign in instead." }` |
| POST | `api/auth/login/volunteer` | No | `VolunteerRequest` | 200 `{ info: "Thank you for volunteering with Health and Hope Clinic. Our team will reach out soon." }` | 400 `{ info: "<field> is required." }`*, 409 `{ info: "A volunteer application with this email already exists." }`* |
| POST | `api/auth/login/patients` (PHI) | No | `PatientRequest` | 200 `{ info: "Thank you. A member of our care team will contact you shortly." }` | 400 `{ info: "<field> is required." }`* |
| POST | `api/auth/login/BHSurvey` (PHI) | No | `BHSurveySubmission` | 200 `{ info: "Thank you for completing the survey." }` | 400 `{ info: "<field> is required." }`* |
| GET | `api/auth/test/patient-table` | No | none | 200 `{ info: "Database connection successful", recordCount: <patient_requests length> }` | — |

## Client

| Method | Path | Auth | Request body | Success | Errors |
|---|---|---|---|---|---|
| GET | `api/client/list` (PHI) | No | none | 200 — array of `Client` | — |
| GET | `api/client/{id}` (PHI) | Yes | none | 200 — `Client` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |
| PUT | `api/client/{id}/edit` (PHI) | Yes | `Client` | 200 — updated `Client` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |
| DELETE | `api/client/{id}/delete` | Yes | none | 200 `{ info: "Deleted" }` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |

## Caregiver

| Method | Path | Auth | Request body | Success | Errors |
|---|---|---|---|---|---|
| GET | `api/caregiver/list` (PHI) | No | none | 200 — array of `Caregiver` | — |
| GET | `api/caregiver/{id}` (PHI) | Yes | none | 200 — `Caregiver` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |
| POST | `api/caregiver/add` (PHI) | Yes | `Caregiver` | 200 — created `Caregiver` with new `caregiver_id` | 401 `{ info: "Unauthorized" }` |
| PUT | `api/caregiver/{id}/edit` (PHI) | Yes | `Caregiver` | 200 — updated `Caregiver` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |
| DELETE | `api/caregiver/{id}/delete` | Yes | none | 200 `{ info: "Deleted" }` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |

## Provider

| Method | Path | Auth | Request body | Success | Errors |
|---|---|---|---|---|---|
| GET | `api/provider/list` | No | none | 200 — array of `Provider` | — |
| GET | `api/provider/{id}` | Yes | none | 200 — `Provider` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |
| POST | `api/provider/add` | Yes | `Provider` | 200 — created `Provider` with new `provider_id` | 401 `{ info: "Unauthorized" }` |
| PUT | `api/provider/{id}/edit` | Yes | `Provider` | 200 — updated `Provider` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |
| DELETE | `api/provider/{id}/delete` | Yes | none | 200 `{ info: "Deleted" }` | 401 `{ info: "Unauthorized" }`, 404 `{ info: "Not found" }` |

## Cross-cutting

| Case | Status | Body |
|---|---|---|
| Unknown route (no match in `ENDPOINTS`) | 404 | `{ info: "Not found" }` |
| Malformed JSON body on any route that takes one | 400 | `{ info: "Body is not valid JSON." }` |
| Any `auth: true` route with no token, or an expired one | 401 | `{ info: "Unauthorized" }` |

23 routes total: 9 Auth, 4 Client, 5 Caregiver, 5 Provider.
