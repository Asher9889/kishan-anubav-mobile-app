import queryClient from "@/shared/api/queryClient";
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
            queryClient.invalidateQueries({
                queryKey: ['userPosts'],
            });
        }
    })

    return mutateKnowledgePost;
}

export { usePostKnowledge };
