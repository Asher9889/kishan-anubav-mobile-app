import { endPoints } from "@/shared/api";
import { nodeApi } from "@/shared/api/axios";

import type { MeResponse } from "../types/user";

const fetchMe = async (): Promise<MeResponse> => {
  const { url, method } = endPoints.AUTH.ME;

  const response = await nodeApi.request({
    url,
    method,
  });

  return response as unknown as MeResponse;
};

export { fetchMe };
