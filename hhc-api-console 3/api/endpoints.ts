// Authoritative route table, verified from AIS.WebApi controllers.
export type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';
export interface PathParam { name: string; type: 'int' | 'long' }
export interface Endpoint {
  tag: 'Auth' | 'Client' | 'Caregiver' | 'Provider';
  method: Method; path: string; auth: boolean; phi?: boolean;
  params?: PathParam[]; bodyExample?: unknown; note?: string;
}

const client = { id: 0, first_name: '', middle_name: '', last_name: '', address1: '', address2: '', city: '', state: '', zipcode: '', phone1: '', phone2: '', email1: '', email2: '', mailing_name: '', mailing_address1: '', mailing_address2: '', team_code: '' };
const caregiver = { caregiver_id: 0, first_name: '', last_name: '', middle_name: '', relationship_to_patient: '', phone_number: '', email: '', user_account_id: null, can_view_phi: false, can_edit_data: false, can_act_on_behalf: false, is_active: true, notes: '', patient_id: null };
const provider = { provider_id: 0, npi: '', first_name: '', last_name: '', middle_name: '', credentials: '', specialty: '', taxonomy_code: '', organization_name: '', organization_type: '', phone_number: '', email: '', address_line1: '', address_line2: '', city: '', state: '', postal_code: '', country: 'US', is_active: true, onboard_date: new Date().toISOString() };

export const ENDPOINTS: Endpoint[] = [
  { tag: 'Auth', method: 'GET', path: 'api/auth/start', auth: false, note: 'Health check' },
  { tag: 'Auth', method: 'POST', path: 'api/auth/generate/token', auth: false, bodyExample: { username: 'user@example.org', password: '' }, note: 'Password login. Returns access_token.' },
  { tag: 'Auth', method: 'POST', path: 'api/auth/login/request-otp', auth: false, bodyExample: { email: '' } },
  { tag: 'Auth', method: 'POST', path: 'api/auth/login/verify-otp', auth: false, bodyExample: { email: '', otp: '' }, note: 'Returns accessToken (camelCase).' },
  { tag: 'Auth', method: 'POST', path: 'api/auth/register', auth: false, bodyExample: { first_name: '', last_name: '', email: '', password: '' }, note: 'Added in this release.' },
  { tag: 'Auth', method: 'POST', path: 'api/auth/login/volunteer', auth: false, bodyExample: { name: '', email: '', phone: '', streetAddress: '', city: '', state: '', zip: '', areaOfInterest: '', additionalInformation: '' }, note: 'Intake form, not auth.' },
  { tag: 'Auth', method: 'POST', path: 'api/auth/login/patients', auth: false, phi: true, bodyExample: { firstName: '', lastName: '', dateOfBirth: '', contactNumber: '', currentHealthStatus: '', medicinesNeeded: '' }, note: 'Intake form, not auth.' },
  { tag: 'Auth', method: 'POST', path: 'api/auth/login/BHSurvey', auth: false, phi: true, bodyExample: { respondentName: '', question1: '', question2: '', question3: '', question4: '', question5: '', phone: '' } },
  { tag: 'Auth', method: 'GET', path: 'api/auth/test/patient-table', auth: false, note: 'Diagnostic' },

  { tag: 'Client', method: 'GET', path: 'api/client/list', auth: false, phi: true, note: 'Unauthenticated in source.' },
  { tag: 'Client', method: 'GET', path: 'api/client/{id}', auth: true, phi: true, params: [{ name: 'id', type: 'int' }] },
  { tag: 'Client', method: 'PUT', path: 'api/client/{id}/edit', auth: true, phi: true, params: [{ name: 'id', type: 'int' }], bodyExample: client },
  { tag: 'Client', method: 'DELETE', path: 'api/client/{id}/delete', auth: true, params: [{ name: 'id', type: 'int' }] },

  { tag: 'Caregiver', method: 'GET', path: 'api/caregiver/list', auth: false, phi: true, note: 'Unauthenticated in source.' },
  { tag: 'Caregiver', method: 'GET', path: 'api/caregiver/{id}', auth: true, phi: true, params: [{ name: 'id', type: 'long' }] },
  { tag: 'Caregiver', method: 'POST', path: 'api/caregiver/add', auth: true, phi: true, bodyExample: caregiver },
  { tag: 'Caregiver', method: 'PUT', path: 'api/caregiver/{id}/edit', auth: true, phi: true, params: [{ name: 'id', type: 'long' }], bodyExample: caregiver },
  { tag: 'Caregiver', method: 'DELETE', path: 'api/caregiver/{id}/delete', auth: true, params: [{ name: 'id', type: 'long' }] },

  { tag: 'Provider', method: 'GET', path: 'api/provider/list', auth: false, note: 'Unauthenticated in source.' },
  { tag: 'Provider', method: 'GET', path: 'api/provider/{id}', auth: true, params: [{ name: 'id', type: 'long' }] },
  { tag: 'Provider', method: 'POST', path: 'api/provider/add', auth: true, bodyExample: provider },
  { tag: 'Provider', method: 'PUT', path: 'api/provider/{id}/edit', auth: true, params: [{ name: 'id', type: 'long' }], bodyExample: provider },
  { tag: 'Provider', method: 'DELETE', path: 'api/provider/{id}/delete', auth: true, params: [{ name: 'id', type: 'long' }] },
];
