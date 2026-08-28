// Wire names taken from JsonPropertyName attributes in AIS.WebApi/Models.

export interface Client {
  id: number; first_name: string; middle_name?: string; last_name: string;
  address1?: string; address2?: string; city?: string; state?: string; zipcode?: string;
  phone1?: string; phone2?: string; email1?: string; email2?: string;
  mailing_name?: string; mailing_address1?: string; mailing_address2?: string; team_code?: string;
}

export interface Caregiver {
  caregiver_id: number; first_name: string; last_name: string; middle_name?: string;
  relationship_to_patient?: string; phone_number?: string; email?: string;
  user_account_id?: number | null; can_view_phi: boolean; can_edit_data: boolean; can_act_on_behalf: boolean;
  is_active: boolean; notes?: string; created_at?: string; created_by?: number | null;
  updated_at?: string | null; updated_by?: number | null; patient_id?: number | null;
}

export interface Provider {
  provider_id: number; npi?: string; first_name: string; last_name: string; middle_name?: string;
  credentials?: string; specialty?: string; taxonomy_code?: string; organization_name?: string; organization_type?: string;
  phone_number?: string; email?: string; address_line1?: string; address_line2?: string; city?: string; state?: string;
  postal_code?: string; country?: string; user_account_id?: number | null;
  provider_plm_version?: string; provider_plm_last_sync?: string | null; provider_plm_public_key?: string | null; // base64
  is_active: boolean; onboard_date?: string; deactivation_date?: string | null;
  created_at?: string; created_by?: number | null; updated_at?: string | null; updated_by?: number | null;
}

export interface LoginData { username: string; password: string }
export interface TokenResponse { access_token: string; help_info?: string }
export interface OtpTokenResponse { accessToken: string; info?: string }
export interface RegisterRequest { first_name: string; last_name: string; email: string; password: string }
export interface ResponseHolder { info: string }

export interface VolunteerRequest { name: string; email: string; phone: string; streetAddress?: string; city?: string; state?: string; zip?: string; areaOfInterest: string; additionalInformation?: string }
export interface PatientRequest { firstName: string; lastName: string; dateOfBirth: string; contactNumber: string; currentHealthStatus: string; medicinesNeeded: string }
export interface BHSurveySubmission { respondentName: string; question1: string; question2: string; question3: string; question4: string; question5: string; phone: string }
