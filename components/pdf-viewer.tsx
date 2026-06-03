import { WebView } from 'react-native-webview';

interface Props {
  pdfUrl: string;
}

export default function PdfViewerScreen({ pdfUrl }: Props) {
  return (
    <WebView
      source={{
        uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}`,
      }}
      style={{ flex: 1 }}
    />
  );
}