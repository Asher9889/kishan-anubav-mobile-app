import { endPoints } from "@/shared/api";
import { nodeApi } from "@/shared/api/axios";
import type { BazaarBhavResponse } from "../types/types";

export interface GetBazaarBhavParams {
  districtName: string;
  cityName: string;
  fromDate: string;
  toDate: string;
}

export async function getBazaarBhav(
  params: GetBazaarBhavParams
) {
  const { url, method } = endPoints.MARKET.FEATURED;
  const response = await nodeApi.request<BazaarBhavResponse>({
    url,
    method,
    params,
  }) as unknown as BazaarBhavResponse;;

  return response 
}
