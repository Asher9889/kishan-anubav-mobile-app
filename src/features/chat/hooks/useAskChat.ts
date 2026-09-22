import {
  useLocalRuntime,
  useRemoteThreadListRuntime,
  type AssistantRuntime,
} from '@assistant-ui/react-native';
import { askChatModelAdapter } from '../ai/ask.adapter';
import { threadListAdapter } from '../ai/thread-list.adapter';
import { useChatStore } from '../store/chat.store';

const useRuntime = () => useLocalRuntime(askChatModelAdapter);

/**
 * Root assistant-ui runtime for the chat screen.
 *
 * `threadId` is controlled by the app-wide `activeChatIdState` (undefined
 * while composing a brand new chat); `onThreadIdChange` mirrors newly settled
 * thread ids back into the store so the rest of the app stays in sync.
 */
export function useAskChat(): AssistantRuntime {
  const activeChatIdState = useChatStore((state) => state.activeChatIdState);
  const setActiveChatId = useChatStore((state) => state.setActiveChatId);

  return useRemoteThreadListRuntime({
    runtimeHook: useRuntime,
    adapter: threadListAdapter,
    threadId: activeChatIdState ?? undefined,
    onThreadIdChange: (threadId) => setActiveChatId(threadId ?? null),
  });
}