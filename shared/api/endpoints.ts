export const API_BASE_URL = "https://krishianubhav.mssplonline.in";

export const endPoints = {
  AI: {
    ASK: {
      url: "/v2/ask",
      method: "POST",
    },
    VOICE: {
      url: "/ask-audio",
      method: "POST",
    },
    VOICE_TO_TEXT: {
      url: "/transcribe",
      method: "POST",
    },
  },

  AUTH: {
    ME: {
      url: "/auth/me",
      method: "GET",
    },
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

  USER: {
    UPDATE_PROFILE: {
      url: "/users/:id",
      method: "PATCH",
    },
    
    CHECK_USERNAME: {
      url: "/users/check-username",
      method: "GET",
    },
  },

  UPLOAD: {
    AVATAR: {
      url: "/uploads/avatar",
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
