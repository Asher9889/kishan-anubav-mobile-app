import type { LucideIcon } from 'lucide-react-native';

interface IFeatureCard {
    icon: LucideIcon,
    title: string, 
    description: string,
    color: string, 
    delay: number
}

interface IQuickAction {
    icon: LucideIcon,
    label: string,
    color: string,
    onPress: () => void
}

interface ITestimonialCard {
    name: string,
    location: string,
    text: string,
    crop: string
}

export interface FeaturedPost {
  knowledge: string;
  images: string[];
  totalLikes: number;
  totalComments: number;
  postedAt: string;
}

export interface FeaturedPostBy {
  id: string;
  name: string;
  avatar: string;
}

export interface FeaturedPostResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: {
    post: FeaturedPost;
    postedBy: FeaturedPostBy;
  };
}

export { IFeatureCard, IQuickAction, ITestimonialCard };
