import { CarouselItem } from "@/components/imageCarousel";
import { endPoints } from "@/shared/api";
import { nodeApi } from "@/shared/api/axios";
import type { FeaturedPostResponse } from "../types/types";

async function getNews(){
    const { url, method } = endPoints.NEWS.KRISHI_NEWS
    const response = await nodeApi.request<CarouselItem[]>({
        url,
        method
    })
    return response.data as CarouselItem[];
}

async function getFeaturedKnowledge() {
    const { url, method } = endPoints.POSTS.FEATURED;
    const response = await nodeApi.request<FeaturedPostResponse>({ url, method });
    return response as unknown as FeaturedPostResponse;
}

export { getFeaturedKnowledge, getNews };
