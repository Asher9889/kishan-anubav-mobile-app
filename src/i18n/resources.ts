import enAuth from './locales/en/auth.json';
import enCommon from './locales/en/common.json';

import hiAuth from './locales/hi/auth.json';
import hiCommon from './locales/hi/common.json';

export const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
  },

  hi: {
    common: hiCommon,
    auth: hiAuth,
  },
} as const;