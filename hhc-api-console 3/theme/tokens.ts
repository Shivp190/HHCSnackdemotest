// HHC design tokens.
// UNVERIFIED: the hex values and fonts below are placeholders chosen for a
// community clinic brand. Replace them with values read from
// https://www.healthandhopeclinic.org stylesheets before release.

export const LOGO_URL: string | null = null; // e.g. "https://www.healthandhopeclinic.org/wp-content/uploads/.../logo.png"

export const MOCK_MODE = true;

export const color = {
  primary: '#123B5C',      // UNVERIFIED  harbor navy — trust, clinical calm
  primaryDeep: '#0B2A44',  // UNVERIFIED
  hope: '#E8A33D',         // UNVERIFIED  amber — the "hope" half of the name
  ink: '#1A2430',
  muted: '#5B6B7A',
  line: '#D9E1E7',
  mist: '#EEF3F6',
  surface: '#FFFFFF',
  danger: '#B3261E',
  ok: '#2E7D4F',
  get: '#2E7D4F',
  post: '#1F6FB2',
  put: '#B26A00',
  del: '#B3261E',
};

export const font = {
  display: undefined as string | undefined, // UNVERIFIED  set to an @expo-google-fonts face once known
  body: undefined as string | undefined,
  mono: 'Menlo',
};

export const space = (n: number) => n * 8;
export const radius = { sm: 6, md: 10, lg: 16 }; // UNVERIFIED
