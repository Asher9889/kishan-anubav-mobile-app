import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';
import enProfile from './locales/en/profile.json';

import hiAuth from './locales/hi/auth.json';
import hiCommon from './locales/hi/common.json';
import hiProfile from './locales/hi/profile.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    profile: enProfile,
  },

  hi: {
    common: hiCommon,
    auth: hiAuth,
    profile: hiProfile,
  },
} as const;