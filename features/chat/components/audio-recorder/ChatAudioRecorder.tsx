import { AudioRecorder } from '@/components';
import { Text } from '@/components/ui/text';
import { useColor } from '@/hooks/useColor';
import { X } from 'lucide-react-native';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

type ChatAudioRecorderProps = {
    onClose?: () => void;
    onRecordingComplete?: (audioUri: string) => void;
};

function ChatAudioRecorder({ onClose, onRecordingComplete }: ChatAudioRecorderProps) {
    const cardColor = useColor('card');
    const surfaceColor = useColor('surface');
    const borderColor = useColor('border');
    const textColor = useColor('text');
    const mutedColor = useColor('textMuted');
    const primaryColor = useColor('primaryContainer');

    return (
        <View style={[styles.wrapper, { backgroundColor: cardColor, borderColor }]}>
            <View style={styles.headerRow}>
                <View style={styles.headerTextBlock}>
                    <Text style={[styles.title, { color: textColor }]}>Voice input</Text>
                    <Text style={[styles.subtitle, { color: mutedColor }]}>Record one message at a time</Text>
                </View>

                <TouchableOpacity
                    onPress={onClose}
                    style={[styles.closeButton, { backgroundColor: surfaceColor, borderColor }]}
                    activeOpacity={0.8}
                >
                    <X size={18} color={textColor} />
                </TouchableOpacity>
            </View>

            <AudioRecorder
                quality='high'
                showTimer={true}
                showWaveform={true}
                maxDuration={300}
                // onRecordingStart={startRecording}
                onRecordingComplete={onRecordingComplete}
                // onRecordingStop={onClose}
                style={[styles.recorder, { backgroundColor: surfaceColor, borderColor }]}
            />

            <View style={styles.accentRow}>
                <View style={[styles.accentDot, { backgroundColor: primaryColor }]} />
                <Text style={[styles.accentText, { color: mutedColor }]}>Your voice will be processed securely</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        borderRadius: 24,
        borderWidth: 1,
        padding: 12,
        gap: 12,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerTextBlock: {
        flex: 1,
        paddingRight: 12,
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
    },
    subtitle: {
        marginTop: 2,
        fontSize: 12,
        fontWeight: '500',
    },
    closeButton: {
        width: 34,
        height: 34,
        borderRadius: 17,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    recorder: {
        width: '100%',
        borderRadius: 20,
    },
    accentRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingHorizontal: 4,
    },
    accentDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    accentText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default ChatAudioRecorder;