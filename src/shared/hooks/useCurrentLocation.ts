import { getCurrentLocation } from "@/shared/services";
import { useQuery } from "@tanstack/react-query";
import { ILocationData } from "../types/types";

type UseCurrentLocationOptions = {
    enabled?: boolean;
};

export function useCurrentLocation(options: UseCurrentLocationOptions = {}) {
    const { enabled = true } = options;

    const response = useQuery<ILocationData>({
        queryKey: ["location"],
        queryFn: getCurrentLocation,
        enabled,
    });
    return response;
}