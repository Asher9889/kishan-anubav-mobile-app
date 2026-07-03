interface ILocationData {
    latitude: number;
    longitude: number;
    city: string;
    region: string;
    country: string;
    subregion: string;
    district: string;
    street: string;
}

interface IWeatherData {
    temperature: number;
    humidity: number;
    rain: number;
    windSpeed?: number;
}


export { ILocationData, IWeatherData };
