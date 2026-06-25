import { useQuery } from "@tanstack/react-query";
import { getNews } from "../api/home.api";

export default function useNews() {
  const newsQuery = useQuery({
    queryKey: ["news"],
    queryFn: getNews,
    staleTime: 5 * 60 * 1000,
  });
  return newsQuery;
}