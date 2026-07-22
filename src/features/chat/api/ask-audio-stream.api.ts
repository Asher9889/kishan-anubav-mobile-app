import { envConfig } from '@/config';
import { api } from '@/shared/api';
import { endPoints } from '@/shared/api/endpoints';
import { StreamHandlers, TranscriptionResponse } from '../types/types';


export async function askAudioStream(audioUri: string, chatId: string, handlers: StreamHandlers,) {

    const { method, url } = endPoints.AI.VOICE;
    const fullUrl = envConfig.aiApiBaseUrl + url;
    console.log("Debug [askAudioStream] hit", fullUrl);

    const formData = new FormData();

    formData.append("file", {
        uri: audioUri,
        type: "audio/mp4",
        // name: `voice-${Date.now()}.m4a`,
        name: `audio.m4a`,
    } as any);
    console.log(chatId, "chatId in askAudioStream");
    console.log("audioUri in askAudioStream", audioUri);

    formData.append("thread_id", chatId);

    const response = await fetch(fullUrl,
        {
            method: method,
            headers: {
                "Accept": 'text/event-stream',
            },
            body: formData,
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        console.log('Audio API Error:', errorText);
        return;
    }

    if (!response.body) {
        console.log('No response body');
        return;
        // throw new Error('No response body');
    }
    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    let buffer = '';

    while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {

            if (!line.startsWith('data: ')) {
                continue;
            }

            const jsonString = line.replace('data: ', '');

            if (jsonString === '[DONE]') { return; }

            try {
                const parsed = JSON.parse(jsonString);
                switch (parsed.event) {

                    case 'metadata':
                        console.log('Metadata received:', parsed);
                        handlers.onMetadata?.(parsed.data);
                        break;

                    case 'start':
                        handlers.onStart?.();
                        break;

                    case 'chunk':
                        handlers.onChunk?.(parsed.data.content);
                        break;

                    case 'complete':
                        handlers.onComplete?.(parsed.data);
                        break;
                }

            } catch (error) {
                console.log('Error parsing JSON:', error);
                handlers.onError?.(error);
            }
        }
    }
}

export async function convertAudioToText(audioUri: string): Promise<TranscriptionResponse> {
    const { method, url } = endPoints.AI.VOICE_TO_TEXT;

    const formData = new FormData();

    formData.append("file", {
        uri: audioUri,
        type: "audio/mp4",
        name: `audio.m4a`,
    } as any);

    const response = await api.request({
        url,
        method,
        data: formData,
    }) as TranscriptionResponse;

    console.log("Transcription response:======", response);

    return response as unknown as TranscriptionResponse;

    // const formData = new FormData();

    // formData.append("file", {
    //     uri: audioUri,
    //     name: "audio.m4a",
    //     type: "audio/mp4",
    // } as any);

    // const response = await fetch(
    //     "https://api.krishi-anubhav-ai.mssplonline.in/transcribe",
    //     {
    //         method: "POST",
    //         body: formData,
    //     }
    // );

    // console.log(response.status);
    // console.log(await response.text());

    // return await response.json() as Promise<TranscriptionResponse>;
}