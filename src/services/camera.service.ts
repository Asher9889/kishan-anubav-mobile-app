import * as ImagePicker from 'expo-image-picker';

export const requestCameraPermission = async () => {
  const result = await ImagePicker.requestCameraPermissionsAsync();

  return result.granted;
};

export const requestGalleryPermission = async () => {
  const result =
    await ImagePicker.requestMediaLibraryPermissionsAsync();

  return result.granted;
};

export const pickFromCamera = async () => {
  const hasPermission = await requestCameraPermission();

  if (!hasPermission) {
    throw new Error('Camera permission denied');
  }

  const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1,
    });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
};

export const pickFromGallery = async () => {
  const hasPermission = await requestGalleryPermission();

  if (!hasPermission) {
    throw new Error('Gallery permission denied');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

  if (result.canceled) {
    return null;
  }

  return result.assets[0];
};


export const ImagePickerService = {
  pickFromCamera,
  pickFromGallery,
};