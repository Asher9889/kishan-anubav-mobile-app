import { getCurrentLocation } from "@/shared/services";
import { useQuery } from "@tanstack/react-query";
import { ILocationData } from "../types/types";

export function useCurrentLocation() {

    const response = useQuery<ILocationData>({
        queryKey: ["location"],
        queryFn: getCurrentLocation
    });
    return response;
}