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

export { IFeatureCard, IQuickAction, ITestimonialCard };
