import { endPoints } from "@/shared/api";
import { nodeApi } from "@/shared/api/axios";
import { NewsDetailData } from "../types/types";

const fetchNewsById = async (id: string) => {
  console.log('fetchNewsById called with id:', id);
  const { url, method } = endPoints.NEWS.NEWS_DETAIL_BY_ID
  const response = await nodeApi.request<NewsDetailData>({
    url: url.replace(':id', id),
    method,
  })

  return response.data as NewsDetailData;
};  

export { fetchNewsById };
