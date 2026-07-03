import { useQuery } from "@tanstack/react-query";

import { getCurrentLocation } from "@/shared/services";
import type { ILocationData } from "@/shared/types/types";

import { getBazaarBhav } from "../api/bazaarBhav.api";

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function useBazaarBhav() {
  const { data: location } = useQuery<ILocationData>({
    queryKey: ["location"],
    queryFn: getCurrentLocation,
    staleTime: 1000 * 60 * 10,
  });

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const fromDate = formatDate(yesterday);
  const toDate = formatDate(today);

  const districtName = location?.district ?? "";
  const cityName = location?.city ?? "";
  const enabled = !!location?.district && !!location?.city;

  console.log("Bazaar Bhav Data:", { districtName, cityName, fromDate, toDate });

  return useQuery({
    queryKey: ["bazaarBhav", districtName, cityName, fromDate, toDate],
    queryFn: () => getBazaarBhav({ districtName, cityName, fromDate, toDate }),
    enabled,
    staleTime: 5 * 60 * 1000,
  });
}
