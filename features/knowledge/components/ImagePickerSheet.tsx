// app/knowledge/_components/controls/ImagePickerSheet.tsx
import React from 'react';
import { Dimensions, Pressable, StyleSheet, Text, View } from 'react-native';
import Modal from 'react-native-modal';
const { height: SCREEN_H } = Dimensions.get('window');
interface ImagePickerSheetProps {
  visible: boolean;
  onClose: () => void;
  onSelect: (source: 'camera' | 'gallery') => void;
  colors: any;
}

 const ImagePickerSheet: React.FC<ImagePickerSheetProps> = ({
  visible,
  onClose,
  onSelect,
  colors,
}) => {
  return (
    <Modal
      isVisible={visible}
      coverScreen={false}
      onSwipeComplete={onClose}
      swipeDirection="down"
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      style={styles.modal}
      backdropOpacity={0}
      animationIn="slideInUp"
      animationOut="slideOutDown"
      animationInTiming={500}
      animationOutTiming={250}
    >
      <View style={[styles.sheet, { backgroundColor: colors.background, flex: 1 }]}>
        <View style={[styles.handle, { backgroundColor: colors.border }]} />
        
        <Text style={[styles.title, { color: colors.text }]}>Add Photo</Text>
        
        <Pressable
          onPress={() => onSelect('camera')}
          style={[styles.option, { backgroundColor: colors.surfaceContainerLow }]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.primaryMuted }]}>
            <Text style={[styles.icon, { color: colors.primary }]}>📷</Text>
          </View>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Take Photo</Text>
            <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>
              Use your camera
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => onSelect('gallery')}
          style={[styles.option, { backgroundColor: colors.surfaceContainerLow }]}
        >
          <View style={[styles.iconCircle, { backgroundColor: colors.secondaryContainer || 'rgba(5,110,0,0.12)' }]}>
            <Text style={[styles.icon, { color: colors.secondary || '#056E00' }]}>🖼️</Text>
          </View>
          <View style={styles.optionText}>
            <Text style={[styles.optionTitle, { color: colors.text }]}>Choose from Gallery</Text>
            <Text style={[styles.optionSubtitle, { color: colors.textMuted }]}>
              Select existing photos
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onClose}
          style={[styles.cancelButton, { backgroundColor: colors.surfaceContainer }]}
        >
          <Text style={[styles.cancelText, { color: colors.textSecondary }]}>Cancel</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 32,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 16,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  icon: {
    fontSize: 24,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  optionSubtitle: {
    fontSize: 13,
    fontWeight: '500',
  },
  cancelButton: {
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ImagePickerSheet;