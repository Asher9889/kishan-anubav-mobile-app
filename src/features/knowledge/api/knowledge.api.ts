import { endPoints } from "@/shared/api";
import { nodeApi } from "@/shared/api/axios";
import { PostKnowledgeApiDTO } from "../types/knowledge.types";

export async function postKnowledge(postData: PostKnowledgeApiDTO) {
    const { url, method } = endPoints.POSTS.POST
    const formData = new FormData();
    console.log(formData instanceof FormData);
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

    console.log("form data entries:");
    for (const pair of formData.entries()) {
        console.log(`${pair[0]}:`, pair[1]);
    }

    const response = await nodeApi.request({
        url: url,
        method: method,
        data: formData,
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    console.log('[API] Post knowledge response:', response);

    return response.data;
}