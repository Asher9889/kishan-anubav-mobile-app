import { create } from 'zustand';

type ChatStore = {
    activeChatIdState: string | null;
    setActiveChatId: (chatId: string | null) => void;
}

const useChatStore = create<ChatStore>((set) => {
    return {
        activeChatIdState: null,
        setActiveChatId: (chatId: string | null) => set({ activeChatIdState: chatId }),
    }
})

export { useChatStore };
