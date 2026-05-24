import axios from "axios";
import { IWeatherData } from "../types/types";

export async function getCurrentWeather(lat: number, long: number): Promise<IWeatherData> {

    const response = await axios.get(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${long}&current=temperature_2m,relative_humidity_2m,rain,windspeed_10m&timezone=Asia/Kolkata`
        );

    const weatherData = {
        temperature: response.data.current.temperature_2m,
        humidity: response.data.current.relative_humidity_2m,
        rain: response.data.current.rain,
        windSpeed: response.data.current.windspeed_10m ?? 23
    }

    return weatherData;
}