import { AudioModule, RecordingPresets, setAudioModeAsync, useAudioRecorder, useAudioRecorderState } from "expo-audio";

import { Alert } from "react-native";

export function useVoiceRecorder() {
    const recorder = useAudioRecorder(RecordingPresets.HIGH_QUALITY);

    const recorderState = useAudioRecorderState(recorder);

    async function startRecording() {
        try {
            // Request permission
            const permission =
                await AudioModule.requestRecordingPermissionsAsync();

            if (!permission.granted) {
                Alert.alert("Microphone permission is required");
                return;
            }

            // Configure audio mode
            await setAudioModeAsync({allowsRecording: true, playsInSilentMode: true});

            // Prepare
            await recorder.prepareToRecordAsync();

            // Start
            recorder.record();

        } catch (error) {
            console.log("Start recording error:", error);
        }
    }

    async function stopRecording() {
        try {
            await recorder.stop();
            return recorder.uri;

        } catch (error) {
            console.log("Stop recording error:", error);
            return null;
        }
    }

    return {
        isRecording: recorderState.isRecording,
        duration: recorderState.durationMillis,
        audioUri: recorder.uri,
        startRecording,
        stopRecording,
    };
}