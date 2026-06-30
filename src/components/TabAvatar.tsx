import { useAuthStore } from '@/features/auth/store/auth.store';
import { Image } from 'expo-image';
import { IconSymbol } from './ui/icon-symbol.ios';

export default function TabAvatar({focused = false}: {focused?: boolean}) {
  const avatar = useAuthStore((state) => state.user?.avatar);

  if (!avatar) {
    return (
      <IconSymbol
        size={28}
        name="person.circle"
        color={focused ? '#2E7D32' : '#999'}
      />
    );
  }

  return (
    <Image
      source={avatar}
      contentFit="cover"
      alt="User Avatar"
      style={{
        
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: focused ? 2 : 0,
        borderColor: '#2E7D32',
      }}
    />
  );
}