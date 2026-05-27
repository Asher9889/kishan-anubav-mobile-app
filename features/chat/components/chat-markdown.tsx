import { Colors } from '@/constants/theme';
import Markdown from 'react-native-markdown-display';

interface ChatMarkdownProps {
  content: string;
  isUser?: boolean;
}

function ChatMarkdown({ content, isUser = false }: ChatMarkdownProps) {
  const textColor = isUser ? Colors.light.textInverse : Colors.light.text;
  const secondaryTextColor = isUser ? Colors.light.textInverse : Colors.light.textSecondary;

  const markdownStyle = {
    paragraph: {
      color: textColor,
      fontSize: 16,
      lineHeight: 24,
      fontWeight: 'normal' as const,
    },
    strong: {
      color: textColor,
      fontWeight: 'bold' as const,
    },
    em: {
      color: textColor,
      fontStyle: 'italic' as const,
    },
    heading1: {
      color: textColor,
      fontSize: 22,
      fontWeight: 'bold' as const,
      marginTop: 8,
      marginBottom: 8,
    },
    heading2: {
      color: textColor,
      fontSize: 20,
      fontWeight: 'bold' as const,
      marginTop: 8,
      marginBottom: 8,
    },
    heading3: {
      color: textColor,
      fontSize: 18,
      fontWeight: 'bold' as const,
      marginTop: 6,
      marginBottom: 6,
    },
    heading4: {
      color: textColor,
      fontSize: 16,
      fontWeight: 'bold' as const,
      marginTop: 6,
      marginBottom: 6,
    },
    heading5: {
      color: textColor,
      fontSize: 14,
      fontWeight: 'bold' as const,
      marginTop: 4,
      marginBottom: 4,
    },
    heading6: {
      color: textColor,
      fontSize: 12,
      fontWeight: 'bold' as const,
      marginTop: 4,
      marginBottom: 4,
    },
    bulletList: {
      color: textColor,
      marginTop: 4,
      marginBottom: 4,
    },
    orderedList: {
      color: textColor,
      marginTop: 4,
      marginBottom: 4,
    },
    listItem: {
      color: textColor,
      fontSize: 16,
      lineHeight: 24,
    },
    blockquote: {
      color: secondaryTextColor,
      borderColor: isUser ? Colors.light.primaryMuted : Colors.light.primary,
      backgroundColor: 'rgba(0,0,0,0.03)',
      paddingLeft: 8,
      marginTop: 6,
      marginBottom: 6,
    },
    inlineCode: {
      color: isUser ? '#FFFFFF' : Colors.light.primary,
      backgroundColor: isUser ? 'rgba(255,255,255,0.15)' : 'rgba(143,78,0,0.08)',
      paddingHorizontal: 4,
      borderRadius: 4,
    },
    link: {
      color: isUser ? '#FFFFFF' : Colors.light.primary,
      textDecorationLine: 'underline' as const,
    }
  };

  return (
    <Markdown style={markdownStyle}>
      {content}
    </Markdown>
  );
}

export default ChatMarkdown;