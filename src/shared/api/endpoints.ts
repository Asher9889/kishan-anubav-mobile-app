export const API_BASE_URL = "https://krishianubhav.mssplonline.in";

export const endPoints = {
  AI: {
    ASK: {
      url: "/v3/ask",
      method: "POST",
    },
    VOICE: {
      url: "/ask-audio",
      method: "POST",
    },
    VOICE_TO_TEXT: {
      url: "/transcribe", // transcribe
      method: "POST",
    },
    QUICK_UPLOAD: {
      url: "/quick-upload",
      method: "POST",
    },
    IMAGE: {
      url: "/ask-image",
      method: "POST",
    }
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
      url: "/users/me",
      method: "PATCH",
    },

    CHECK_USERNAME: {
      url: "/users/check-username",
      method: "GET",
    },

    GET_PROFILE: {
      url: "/users/:id",
      method: "GET",
    },

    FOLLOW: {
      url: "/users/:id/follow",
      method: "POST",
    },

    UNFOLLOW: {
      url: "/users/:id/follow",
      method: "DELETE",
    },
  },

  POSTS: {
    GET: {
      url: "/posts",
      method: "GET",
    },
    POST: {
      url: "/posts",
      method: "POST",
    },
    LIKE: {
      url: "/posts",
      method: "POST",
    },
    UNLIKE: {
      url: "/posts",
      method: "DELETE",
    },

    FEATURED: {
      url: "/posts/feature",
      method: "GET",
    },
  },

  FEED: {
    GET: {
      url: "/feed",
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

  NEWS: {
    KRISHI_NEWS: {
      url: "/news",
      method: "GET",
    },
    NEWS_DETAIL_BY_ID: {
      url: "/news/:id",
      method: "GET",
    }
  },

  TRANSLATION: {
    TRANSLATE: {
      url: "/translations",
      method: "POST",
    },
  },

  MARKET: {
    FEATURED: {
      url: "/market/feature",
      method: "GET",
    },
  },

  // Livekit token generation endpoint
  LIVEKIT: {
    GENERATE_TOKEN: {
      url: "/voice/session",
      method: "POST",
    },
  },
};
