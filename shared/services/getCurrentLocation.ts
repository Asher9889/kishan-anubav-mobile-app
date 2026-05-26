import * as Location from "expo-location";
import { ILocationData } from "../types/types";

export default async function getCurrentLocation(): Promise<ILocationData> {
    const Permission = await Location.requestForegroundPermissionsAsync();
    if (!Permission.granted) {
        console.log("Location permission not granted");
        throw new Error("Location permission not granted");
    }
    const position = await Location.getCurrentPositionAsync();

    const addresses = await Location.reverseGeocodeAsync({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
    });

    const address = addresses[0];

    return {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        city: address.city ?? "",
        region: address.region ?? "",
        country: address.country ?? "",
        subregion: address.subregion ?? "",
        district: address.district ?? "",
        street: address.street ?? "",
    };
}
