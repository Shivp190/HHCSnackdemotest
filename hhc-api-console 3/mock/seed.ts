import type { Client, Caregiver, Provider } from '../api/types';

export interface SeedUser {
  id: string;
  email: string;
  password: string | null; // null = no credential yet (created via request-otp)
  first_name: string;
  last_name: string;
}

export interface OtpRecord {
  email: string;
  code: string;
  expiresAt: number; // unix ms
}

export interface VolunteerRow {
  id: number; name: string; email: string; phone: string;
  streetAddress?: string; city?: string; state?: string; zip?: string;
  areaOfInterest: string; additionalInformation?: string;
}

export interface PatientRequestRow {
  id: number; firstName: string; lastName: string; dateOfBirth: string;
  contactNumber: string; currentHealthStatus: string; medicinesNeeded: string;
}

export interface SurveyRow {
  id: number; respondentName: string; question1: string; question2: string;
  question3: string; question4: string; question5: string; phone: string;
}

export interface SeedData {
  users: SeedUser[];
  otps: OtpRecord[];
  clients: Client[];
  caregivers: Caregiver[];
  providers: Provider[];
  volunteers: VolunteerRow[];
  patient_requests: PatientRequestRow[];
  surveys: SurveyRow[];
}

// NPIs below are shaped 1XXXXXXXXX for realism only — they are NOT Luhn-valid
// National Provider Identifiers.

export const SEED: SeedData = {
  users: [
    {
      id: '3f1a9c2e-6b8d-4c2a-9e7f-1a2b3c4d5e6f',
      email: 'demo@healthandhopeclinic.org',
      password: 'HopeDemo2026',
      first_name: 'Demo',
      last_name: 'Staff',
    },
    {
      id: '8d2b5f10-4e3a-4a1c-8b6d-2c3d4e5f6a7b',
      email: 'otp-only@healthandhopeclinic.org',
      password: null,
      first_name: '',
      last_name: '',
    },
  ],
  otps: [],
  clients: [
    { id: 1, first_name: 'Ada', last_name: 'Rowlings', address1: '412 Palafox St', city: 'Pensacola', state: 'FL', zipcode: '32501', phone1: '850-555-0101', email1: 'ada.rowlings@example.com', team_code: 'RED' },
    { id: 2, first_name: 'Marcus', last_name: 'Delane', address1: '118 Garden St', city: 'Pensacola', state: 'FL', zipcode: '32502', phone1: '850-555-0102', email1: 'marcus.delane@example.com', team_code: 'BLUE' },
    { id: 3, first_name: 'Priya', last_name: 'Vantell', address1: '905 E Cervantes St', city: 'Pensacola', state: 'FL', zipcode: '32503', phone1: '850-555-0103', team_code: 'GREEN' },
    { id: 4, first_name: 'Owen', last_name: 'Castellan', address1: '227 W Gregory St', city: 'Pensacola', state: 'FL', zipcode: '32502', phone1: '850-555-0104', email1: 'owen.castellan@example.com', team_code: 'RED' },
    { id: 5, first_name: 'Reina', last_name: 'Fossum', address1: '76 N Reus St', city: 'Pensacola', state: 'FL', zipcode: '32501', phone1: '850-555-0105', team_code: 'BLUE' },
    { id: 6, first_name: 'Talon', last_name: 'Whitfield', address1: '340 E Wright St', city: 'Pensacola', state: 'FL', zipcode: '32501', phone1: '850-555-0106', email1: 'talon.whitfield@example.com', team_code: 'GREEN' },
    { id: 7, first_name: 'Marisol', last_name: 'Quintara', address1: '1203 N 12th Ave', city: 'Pensacola', state: 'FL', zipcode: '32503', phone1: '850-555-0107', team_code: 'RED' },
    { id: 8, first_name: 'Gideon', last_name: 'Ashworth', address1: '55 W Chase St', city: 'Pensacola', state: 'FL', zipcode: '32502', phone1: '850-555-0108', team_code: 'BLUE' },
    { id: 9, first_name: 'Noelani', last_name: 'Brackston', address1: '890 E Blount St', city: 'Pensacola', state: 'FL', zipcode: '32503', phone1: '850-555-0109', email1: 'noelani.brackston@example.com', team_code: 'GREEN' },
    { id: 10, first_name: 'Ezra', last_name: 'Muldane', address1: '410 W Government St', city: 'Pensacola', state: 'FL', zipcode: '32502', phone1: '850-555-0110', team_code: 'RED' },
    { id: 11, first_name: 'Camille', last_name: 'Osterholt', address1: '68 N Baylen St', city: 'Pensacola', state: 'FL', zipcode: '32501', phone1: '850-555-0111', team_code: 'BLUE' },
    { id: 12, first_name: 'Jasper', last_name: 'Kinnick', address1: '733 E Lloyd St', city: 'Pensacola', state: 'FL', zipcode: '32503', phone1: '850-555-0112', team_code: 'GREEN' },
  ],
  caregivers: [
    { caregiver_id: 101, first_name: 'Dana', last_name: 'Rowlings', relationship_to_patient: 'Daughter', phone_number: '850-555-0121', email: 'dana.rowlings@example.com', user_account_id: null, can_view_phi: true, can_edit_data: false, can_act_on_behalf: true, is_active: true, notes: '', patient_id: 1, created_at: '2025-11-03T14:12:00Z', updated_at: null },
    { caregiver_id: 102, first_name: 'Cole', last_name: 'Delane', relationship_to_patient: 'Son', phone_number: '850-555-0122', email: 'cole.delane@example.com', user_account_id: null, can_view_phi: true, can_edit_data: true, can_act_on_behalf: false, is_active: true, notes: '', patient_id: 2, created_at: '2025-11-05T09:30:00Z', updated_at: null },
    { caregiver_id: 103, first_name: 'Yara', last_name: 'Vantell', relationship_to_patient: 'Spouse', phone_number: '850-555-0123', email: 'yara.vantell@example.com', user_account_id: null, can_view_phi: true, can_edit_data: true, can_act_on_behalf: true, is_active: true, notes: '', patient_id: 3, created_at: '2025-12-01T11:00:00Z', updated_at: null },
    { caregiver_id: 104, first_name: 'Ben', last_name: 'Castellan', relationship_to_patient: 'Brother', phone_number: '850-555-0124', email: '', user_account_id: null, can_view_phi: false, can_edit_data: false, can_act_on_behalf: false, is_active: true, notes: 'Emergency contact only', patient_id: 4, created_at: '2026-01-10T16:45:00Z', updated_at: null },
    { caregiver_id: 105, first_name: 'Sela', last_name: 'Fossum', relationship_to_patient: 'Mother', phone_number: '850-555-0125', email: 'sela.fossum@example.com', user_account_id: null, can_view_phi: true, can_edit_data: false, can_act_on_behalf: true, is_active: false, notes: 'Moved out of area', patient_id: 5, created_at: '2025-09-22T13:20:00Z', updated_at: '2026-02-14T10:05:00Z' },
    { caregiver_id: 106, first_name: 'Nash', last_name: 'Whitfield', relationship_to_patient: 'Father', phone_number: '850-555-0126', email: 'nash.whitfield@example.com', user_account_id: null, can_view_phi: true, can_edit_data: true, can_act_on_behalf: true, is_active: true, notes: '', patient_id: 6, created_at: '2026-03-02T08:15:00Z', updated_at: null },
  ],
  providers: [
    { provider_id: 1001, npi: '1234567801', first_name: 'Renata', last_name: 'Colville', credentials: 'MD', specialty: 'Primary Care', organization_name: 'Health and Hope Clinic', organization_type: 'Clinic', phone_number: '850-555-0201', email: 'r.colville@healthandhopeclinic.org', address_line1: '6770 N 9th Ave', city: 'Pensacola', state: 'FL', postal_code: '32504', country: 'US', is_active: true, onboard_date: '2022-04-11T00:00:00Z', provider_plm_public_key: 'bW9ja3B1YmxpY2tleTAwMQ==' },
    { provider_id: 1002, npi: '1234567802', first_name: 'Harlan', last_name: 'Ottway', credentials: 'DDS', specialty: 'Dental', organization_name: 'Health and Hope Clinic', organization_type: 'Clinic', phone_number: '850-555-0202', email: 'h.ottway@healthandhopeclinic.org', address_line1: '6770 N 9th Ave', city: 'Pensacola', state: 'FL', postal_code: '32504', country: 'US', is_active: true, onboard_date: '2021-09-01T00:00:00Z', provider_plm_public_key: null },
    { provider_id: 1003, npi: '1234567803', first_name: 'Ingrid', last_name: 'Masterson', credentials: 'MD', specialty: 'Rheumatology', organization_name: 'Gulf Coast Rheumatology Partners', organization_type: 'Private Practice', phone_number: '850-555-0203', email: 'i.masterson@example.org', address_line1: '2100 Medical Dr', city: 'Pensacola', state: 'FL', postal_code: '32504', country: 'US', is_active: true, onboard_date: '2023-01-15T00:00:00Z', provider_plm_public_key: null },
    { provider_id: 1004, npi: '1234567804', first_name: 'Desmond', last_name: 'Achebe', credentials: 'MD', specialty: 'Dermatology', organization_name: 'Baptist Health Partners', organization_type: 'Hospital', phone_number: '850-555-0204', email: 'd.achebe@example.org', address_line1: '1717 N E St', city: 'Pensacola', state: 'FL', postal_code: '32501', country: 'US', is_active: true, onboard_date: '2020-06-20T00:00:00Z', provider_plm_public_key: null },
    { provider_id: 1005, npi: '1234567805', first_name: 'Petra', last_name: 'Lindqvist', credentials: 'DO', specialty: 'Orthopedics', organization_name: 'Coastal Orthopedic Group', organization_type: 'Private Practice', phone_number: '850-555-0205', email: 'p.lindqvist@example.org', address_line1: '5000 University Pkwy', city: 'Pensacola', state: 'FL', postal_code: '32514', country: 'US', is_active: false, onboard_date: '2019-03-10T00:00:00Z', deactivation_date: '2025-08-01T00:00:00Z', provider_plm_public_key: null },
    { provider_id: 1006, npi: '1234567806', first_name: 'Miles', last_name: 'Petrakis', credentials: 'DC', specialty: 'Chiropractic', organization_name: 'Health and Hope Clinic', organization_type: 'Clinic', phone_number: '850-555-0206', email: 'm.petrakis@healthandhopeclinic.org', address_line1: '6770 N 9th Ave', city: 'Pensacola', state: 'FL', postal_code: '32504', country: 'US', is_active: true, onboard_date: '2024-02-01T00:00:00Z', provider_plm_public_key: 'bW9ja3B1YmxpY2tleTAwNg==' },
    { provider_id: 1007, npi: '1234567807', first_name: 'Solenne', last_name: 'Aubrac', credentials: 'CNM', specialty: "Women's Health", organization_name: 'Health and Hope Clinic', organization_type: 'Clinic', phone_number: '850-555-0207', email: 's.aubrac@healthandhopeclinic.org', address_line1: '6770 N 9th Ave', city: 'Pensacola', state: 'FL', postal_code: '32504', country: 'US', is_active: true, onboard_date: '2023-07-19T00:00:00Z', provider_plm_public_key: null },
    { provider_id: 1008, npi: '1234567808', first_name: 'Tobias', last_name: 'Kwan', credentials: 'LCSW', specialty: 'Behavioral Health', organization_name: 'Health and Hope Clinic', organization_type: 'Clinic', phone_number: '850-555-0208', email: 't.kwan@healthandhopeclinic.org', address_line1: '6770 N 9th Ave', city: 'Pensacola', state: 'FL', postal_code: '32504', country: 'US', is_active: true, onboard_date: '2022-11-05T00:00:00Z', provider_plm_public_key: null },
  ],
  volunteers: [],
  patient_requests: [],
  surveys: [],
};
