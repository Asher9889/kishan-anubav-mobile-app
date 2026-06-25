import * as ImagePicker from 'expo-image-picker';
import { ImagePickerAsset } from 'expo-image-picker';
import { Alert, Linking } from 'react-native';

export const useAvatarPicker = () => {
  const pickAvatar = async (): Promise<ImagePickerAsset | undefined> => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      if (permission.canAskAgain) {
        Alert.alert('Permission Required', 'Please allow media access.');
      } else {
        Alert.alert(
          'Permission Required',
          'Please enable media library access in Settings.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => Linking.openSettings() },
          ]
        );
      }
      return undefined;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]?.uri) {
      return result.assets[0];
    }
    return undefined;
  };

  return { pickAvatar };
};

