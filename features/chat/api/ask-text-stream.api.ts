import { fetch } from 'expo/fetch';
import { StreamHandlers } from '../types/types';


export async function askQuestionStream(query: string, chatId: string | null, handlers: StreamHandlers,) {

    const url = "https://krishianubhav.mssplonline.in/ask";
    const response = await fetch(url,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Accept":'text/event-stream',
            },
            body: JSON.stringify({
                text: query,
                thread_id: chatId,
            }),
        }
    );

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

        buffer += decoder.decode( value, { stream: true });

        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {

            if (!line.startsWith('data: ')) {
                continue;
            }

            const jsonString =line.replace('data: ','');

            if (jsonString === '[DONE]') {return;}

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