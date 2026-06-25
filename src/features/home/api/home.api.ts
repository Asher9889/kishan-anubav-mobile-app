import { CarouselItem } from "@/components/imageCarousel";
import { endPoints } from "@/shared/api";
import { nodeApi } from "@/shared/api/axios";

async function getNews(){
    const { url, method } = endPoints.NEWS.KRISHI_NEWS
    const response = await nodeApi.request<CarouselItem[]>({
        url,
        method
    })
    return response.data as CarouselItem[];
}

export { getNews };
