import { z } from 'zod';
import { OCCUPATIONS } from '../types/profile.types';


const genderValues = [
  'MALE',
  'FEMALE',
  'OTHER',
] as const;


const requiredTrimmedString = (fieldName: string) =>
  z.string().refine((value) => value.trim().length > 0, {
    message: `${fieldName} is required`,
  });

export const editProfileSchema = z.object({
  fullName: requiredTrimmedString('Name').refine(
    (value) => value.trim().length <= 80,
    'Name must be 80 characters or less'
  ),
  username: requiredTrimmedString('Username')
    .refine(
      (value) => /^[a-zA-Z][a-zA-Z0-9_]{2,29}$/.test(value.trim()),
      'Username must start with a letter and use 3-30 letters, numbers, or underscores'
    ),
  bio: requiredTrimmedString('Bio').refine(
    (value) => value.trim().length <= 160,
    'Bio must be 160 characters or less'
  ),
  gender: z.union([z.enum(genderValues), z.literal('')]).refine(Boolean, {
    message: 'Select your gender',
  }),
  occupation: z.union([z.enum(Object.values(OCCUPATIONS)), z.literal('')]),
  state: requiredTrimmedString('State'),
  city: requiredTrimmedString('City'),
  address: requiredTrimmedString('Address'),
  avatarUri: requiredTrimmedString('Profile photo'),
  website: z.string(),
});

export type EditProfileFormValues = z.input<typeof editProfileSchema>;
