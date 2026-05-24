import { useQuery } from "@tanstack/react-query";
import { getCurrentWeather } from "../services/getCurrentWeather";
import { IWeatherData } from "../types/types";
import { useCurrentLocation } from "./useCurrentLocation";

function useCurrentWeather() {

    const { data:location } = useCurrentLocation();

    const weatherData = useQuery<IWeatherData>({
        queryKey: ['weather', location?.latitude, location?.longitude],
        enabled: !!location, // Only fetch weather data when location is available
        queryFn: () => getCurrentWeather(location!.latitude, location!.longitude),
        staleTime: 10 * 60 * 1000, // Data is considered fresh for 5 minutes
    })

  return weatherData;
}

export default useCurrentWeather;