import { useMutation } from "@tanstack/react-query";
import { generateLivekitToken } from "../api/voice.api";

const useVoiceChat = () => {

    const generateTokenMutation = useMutation({
        mutationFn: generateLivekitToken,
    });



    

    return {
        generateTokenMutation,
    };

}

export default useVoiceChat;