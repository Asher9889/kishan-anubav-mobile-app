import { getCurrentLocation } from "@/shared/services";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ILocationData } from "../types/types";
import { useTranslate } from "./useTranslate";

type UseCurrentLocationOptions = {
    enabled?: boolean;
};

type UseCurrentLocationReturn = {
    englishLocation: ILocationData | undefined;
    localizedLocation: ILocationData | undefined;
    loading: boolean;
    error: Error | null;
};

export function useCurrentLocation(options: UseCurrentLocationOptions = {}): UseCurrentLocationReturn {
    const { enabled = true } = options;
    const { i18n } = useTranslation();
    const language = i18n.language;

    const locationQuery = useQuery<ILocationData>({
        queryKey: ["location"],
        queryFn: getCurrentLocation,
        enabled,
        staleTime: 1000 * 60 * 10, // 10 minutes
    });

    const englishLocation = locationQuery.data;

    const cityTrans = useTranslate(englishLocation?.city ?? "", language);
    const regionTrans = useTranslate(englishLocation?.region ?? "", language);
    const countryTrans = useTranslate(englishLocation?.country ?? "", language);

    const localizedLocation = englishLocation && language !== "en"
        ? {
            ...englishLocation,
            city: cityTrans.data ?? englishLocation.city,
            region: regionTrans.data ?? englishLocation.region,
            country: countryTrans.data ?? englishLocation.country,
        }
        : englishLocation;

    return {
        englishLocation,
        localizedLocation,
        loading: locationQuery.isLoading,
        error: locationQuery.error,
    };
}
