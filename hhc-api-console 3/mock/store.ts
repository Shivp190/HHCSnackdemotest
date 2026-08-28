import { SEED, SeedData } from './seed';

function deepCopy<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

class Store {
  data: SeedData;
  private counters!: {
    client: number;
    caregiver: number;
    provider: number;
    volunteer: number;
    patientRequest: number;
    survey: number;
  };

  constructor() {
    this.data = deepCopy(SEED);
    this.counters = this.computeCounters();
  }

  private computeCounters() {
    const maxId = (rows: Array<Record<string, unknown>>, key: string) =>
      rows.reduce((m, r) => Math.max(m, Number(r[key]) || 0), 0);
    return {
      client: maxId(this.data.clients as unknown as Array<Record<string, unknown>>, 'id') + 1,
      caregiver: maxId(this.data.caregivers as unknown as Array<Record<string, unknown>>, 'caregiver_id') + 1,
      provider: maxId(this.data.providers as unknown as Array<Record<string, unknown>>, 'provider_id') + 1,
      volunteer: maxId(this.data.volunteers as unknown as Array<Record<string, unknown>>, 'id') + 1,
      patientRequest: maxId(this.data.patient_requests as unknown as Array<Record<string, unknown>>, 'id') + 1,
      survey: maxId(this.data.surveys as unknown as Array<Record<string, unknown>>, 'id') + 1,
    };
  }

  nextClientId() { return this.counters.client++; }
  nextCaregiverId() { return this.counters.caregiver++; }
  nextProviderId() { return this.counters.provider++; }
  nextVolunteerId() { return this.counters.volunteer++; }
  nextPatientRequestId() { return this.counters.patientRequest++; }
  nextSurveyId() { return this.counters.survey++; }

  /** Deep-copies the seed back over the live tables and resets every counter. */
  reset() {
    this.data = deepCopy(SEED);
    this.counters = this.computeCounters();
  }
}

// Module-level singleton: this instance lives for the lifetime of the JS
// bundle, so edits persist across sign-out/sign-in and are only cleared by
// reset() or a full reload.
export const store = new Store();
