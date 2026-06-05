import { useMutation } from "@tanstack/react-query";
import { postKnowledge } from "../api/knowledge.api";


const usePostKnowledge = () => {
    const mutateKnowledgePost = useMutation({
        mutationFn: postKnowledge,
        onError: (error) => {
            console.log('[Inbuit-Mutation]Error posting knowledge:', error);
        },
        onSuccess: (data) => {
            console.log('[Inbuit-Mutation]Knowledge posted successfully:', data);
        }
    })

    return mutateKnowledgePost;
}

export { usePostKnowledge };
