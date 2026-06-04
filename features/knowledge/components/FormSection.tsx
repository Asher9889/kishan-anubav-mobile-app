// app/knowledge/_components/sections/FormSection.tsx
import React, { useRef } from 'react';
import { TextInput, View } from 'react-native';
import { DescriptionInput } from './DescriptionInput';
import { TitleInput } from './TitleInput';

interface FormSectionProps {
  title: string;
  onTitleChange: (text: string) => void;
  description: string;
  onDescriptionChange: (text: string) => void;
  titleError?: string;
  descriptionError?: string;
  maxTitleLength: number;
  maxDescriptionLength: number;
  colors: any;
  typography: any;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  titleError,
  descriptionError,
  maxTitleLength,
  maxDescriptionLength,
  colors,
  typography,
}) => {
  const titleRef = useRef<TextInput>(null);
  const descRef = useRef<TextInput>(null);

  return (
    <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
      <TitleInput
        ref={titleRef}
        value={title}
        onChangeText={onTitleChange}
        error={titleError}
        maxLength={maxTitleLength}
        colors={colors}
        typography={typography}
        onSubmitEditing={() => descRef.current?.focus()}
      />

      <DescriptionInput
        ref={descRef}
        value={description}
        onChangeText={onDescriptionChange}
        error={descriptionError}
        maxLength={maxDescriptionLength}
        colors={colors}
        typography={typography}
      />
    </View>
  );
};