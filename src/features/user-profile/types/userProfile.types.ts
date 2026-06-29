export interface UserProfileData {
  id: string;
  fullName: string;
  name: string | null;
  username: string;
  bio: string;
  occupation: string | null;
  avatar: string | null;
  state: string | null;
  city: string | null;
  district: string | null;
  village: string | null;
  postsCount: number;
  followersCount: number;
  followingCount: number;
}

export interface UserProfileApiResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    user: UserProfileData;
  };
}
