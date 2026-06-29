export type GenderValue = 'MALE' | 'FEMALE' | 'OTHER';

export interface GenderOption {
  label: string;
  value: GenderValue;
}

export const GENDER_OPTIONS: GenderOption[] = [
  { label: 'Male', value: 'MALE' },
  { label: 'Female', value: 'FEMALE' },
  { label: 'Other', value: 'OTHER' },
];

export const OCCUPATIONS = {
  FARMER: "Farmer",
  AGRONOMIST: "Agronomist",
  VETERINARIAN: "Veterinarian",
  AGRICULTURE_STUDENT: "Agriculture Student",
  RESEARCHER: "Researcher",
  AGRICULTURE_OFFICER: "Agriculture Officer",
  TRADER: "Trader",
  COMMISSION_AGENT: "Commission Agent",
  INPUT_DEALER: "Input Dealer",
  FARM_CONSULTANT: "Farm Consultant",
  DAIRY_FARMER: "Dairy Farmer",
  POULTRY_FARMER: "Poultry Farmer",
  HORTICULTURE_FARMER: "Horticulture Farmer",
  OTHER: "Other",
} as const;

export interface UpdateProfileData {
  id: string;
  fullName: string;
  username: string;
  avatar: string;
  bio: string;
  gender: string;
  occupation: string;
  phone: string;
  address: {
    line1: string | null;
    city: string | null;
    district: string | null;
    state: string | null;
    country: string | null;
    latitude: number | null;
    longitude: number | null;
  };
  isProfileCompleted?: boolean;
}

export type TOccupation = typeof OCCUPATIONS[keyof typeof OCCUPATIONS];


export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
}

export interface Post {
    id: string;
    userId: string;
    name: string;
    location: string;
    state: string;
    district: string;
    knowledge: string;
    images: string[];
    likesCount: number;
    commentsCount: number;
    isActive: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface PostsData {
    posts: Post[];
    totalPosts: number;
}

export type GetPostsResponse = ApiResponse<PostsData>;