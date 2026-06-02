export type AuthUser = {
  id: string;
  phone: string;
  fullName?: string | null;
  name?: string | null;
  username?: string | null;
  bio?: string | null;
  occupation?: string | null;
  gender?: string | null;
  role?: string | null;
  avatar?: string | null;
  state?: string | null;
  city?: string | null;
  address?: any;
  latitude?: number | null;
  longitude?: number | null;
  village?: string | null;
  district?: string | null;
  isProfileCompleted?: boolean;
  createdAt?: string | null;
};

export type MeResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: AuthUser;
  };
};