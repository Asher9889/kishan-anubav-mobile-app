import { useQuery } from "@tanstack/react-query";

import { getBazaarBhav } from "../api/bazar-bhav.api";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function useMarketPrices(cityName: string, districtName: string) {
  const today = new Date();
  const fromDate = formatDate(today);
  const toDate = formatDate(today);
  const enabled = !!cityName;

  return useQuery({
    queryKey: ["marketPrice", cityName, districtName, fromDate, toDate],
    queryFn: () => getBazaarBhav({ districtName, cityName, fromDate, toDate }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
