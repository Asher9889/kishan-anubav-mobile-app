import { api, endPoints } from "@/shared/api";
import { PostKnowledgeApiDTO } from "../types/knowledge.types";


//postData: PostKnowledgeApiDTO
export async function postKnowledge(postData: PostKnowledgeApiDTO){
    const {url, method} = endPoints.AI.QUICK_UPLOAD;
    const formData = new FormData();
    formData.append('name', postData.userinfo.name);
    formData.append('location', postData.userinfo.location);
    formData.append('district', postData.userinfo.district);
    formData.append('state', postData.userinfo.state);
    formData.append('knowledge', postData.knowledge);
    postData.images.forEach((image, index) => {
        formData.append('images', {
            uri: image.uri,
            type: image.mime,
            name: `image_${index}.${image.mime.split('/')[1]}`
        } as any);
    });

    console.log('[API] Posting knowledge with data:', postData);


    const response = await api.request({
        url: url,
        method: method,
        data: formData
    });

    return response.data;
}