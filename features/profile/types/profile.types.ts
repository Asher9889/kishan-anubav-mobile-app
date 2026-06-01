export type GenderValue = 'MALE' | 'FEMALE' | 'NON-BINARY' | 'PREFER-NOT-TO-SAY' | 'OTHER';

export interface GenderOption {
  label: string;
  value: GenderValue;
}

export const GENDER_OPTIONS: GenderOption[] = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Non-Binary', value: 'NON-BINARY' },
  { label: 'Prefer Not to Say', value: 'PREFER-NOT-TO-SAY' },
  { label: 'Other', value: 'OTHER' },
];

export const OCCUPATIONS = {
  FARMER: 'Farmer',
  STUDENT: 'Student',
  BUSINESS: 'Business Owner',
  SERVICE: 'Service / Job',
  HOUSEWIFE: 'Housewife',
  OTHER: 'Other',
} as const;

export type TOccupation = typeof OCCUPATIONS[keyof typeof OCCUPATIONS];
