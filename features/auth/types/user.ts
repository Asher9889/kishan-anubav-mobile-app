export type AuthUser = {
  id: string;
  phone: string;
  name?: string | null;
  username?: string | null;
  role?: string | null;
  avatar?: string | null;
  village?: string | null;
  district?: string | null;
  state?: string | null;
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