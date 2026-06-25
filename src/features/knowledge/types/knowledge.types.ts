
export interface PostFormData {
  title: string;
  description: string;
  images: PostImage[];
}

export interface PostImage {
  id: string;
  uri: string;
  width: number;
  height: number;
  mime: string;
  size?: number;
}

export interface PostKnowledgeApiDTO {
  userinfo: {
    name: string
    location: string
    district: string
    state: string
  },
  knowledge: string
  images: PostImage[]
}

export interface CreatePostScreenProps {
  onSubmit: (data: PostFormData) => Promise<void>;
  onCancel: () => void;
  maxImages?: number;
  maxTitleLength?: number;
  maxDescriptionLength?: number;
}

export type PickerSource = 'camera' | 'gallery';