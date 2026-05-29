export const API_BASE_URL = "https://krishianubhav.mssplonline.in";

export const endPoints = {
  AI: {
    ASK: {
        url: "/ask",
        method: "POST",
    },
    VOICE: {
        url: "/ask-audio",
        method: "POST",
    },
  },

  AUTH: {
    SEND_OTP: {
        url: "/auth/send-otp",
        method: "POST",
    },
    VERIFY_OTP: {
      url: "/auth/verify-otp",
      method: "POST",
    },
    REFRESH_TOKEN: {
      url: "/auth/refresh-token",
      method: "POST",
    },
    LOGIN: {
        url: "/auth/login",
        method: "POST",
    },
    REGISTER: {
        url: "/auth/register",
        method: "POST",
    },
  },

  WEATHER: {
    CURRENT: {
        url: "/weather/current",
        method: "GET",
    },
  },
};