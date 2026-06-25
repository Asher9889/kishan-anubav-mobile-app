import { useQuery } from "@tanstack/react-query";
import { fetchUserPost } from "../api/profile.api";
import { GetPostsResponse } from "../types/profile.types";

const usePostDataFetcher = () => {
  const query = useQuery<GetPostsResponse>({
    queryKey: ['userPosts'],
    queryFn: fetchUserPost,
  });

  return query;
}

export default usePostDataFetcher;