import { getCurrentLocation } from "@/shared/services";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ILocationData } from "../types/types";
import { useTranslate } from "./useTranslate";

type UseCurrentLocationOptions = {
    enabled?: boolean;
};

export function useCurrentLocation(options: UseCurrentLocationOptions = {}) {
    const { enabled = true } = options;
    const { i18n } = useTranslation();
    const language = i18n.language;

    const locationQuery = useQuery<ILocationData>({
        queryKey: ["location"],
        queryFn: getCurrentLocation,
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    const data = locationQuery.data;

    const cityTrans = useTranslate(data?.city ?? "", language);
    const regionTrans = useTranslate(data?.region ?? "", language);
    const countryTrans = useTranslate(data?.country ?? "", language);

    const mergedData = data
        ? {
            ...data,
            ...(language !== "en"
                ? {
                    city: cityTrans.data ?? data.city,
                    region: regionTrans.data ?? data.region,
                    country: countryTrans.data ?? data.country,
                }
                : {}),
        }
        : undefined;

    return {
        ...locationQuery,
        data: mergedData,
        isTranslating:
            cityTrans.isFetching ||
            regionTrans.isFetching ||
            countryTrans.isFetching,
    };
}