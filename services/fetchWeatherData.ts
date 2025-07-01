import { ForecastDay } from "../models/forecastDay";
import { mapWeatherCodeToIcon } from "../utils/weatherCodeMapper";

export const fetchWeatherData = async (lat: number, lon: number): Promise<ForecastDay[]> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode` +
        `&daily=sunshine_duration&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Błąd API pogodowego");
    }

    const data = await response.json();

    if (
        !data.hourly || !data.daily ||
        ![data.hourly.time, data.hourly.temperature_2m, data.hourly.relative_humidity_2m, data.hourly.wind_speed_10m, data.hourly.weathercode]
            .every(Array.isArray) ||
        !Array.isArray(data.daily.sunshine_duration)
    ) {
        throw new Error("Nieprawidłowy format odpowiedzi z API pogodowego");
    }

    const length = data.hourly.time.length;
    if (
        [data.hourly.temperature_2m, data.hourly.relative_humidity_2m, data.hourly.wind_speed_10m, data.hourly.weathercode]
            .some(arr => arr.length !== length)
    ) {
        throw new Error("Nieprawidłowe długości danych w odpowiedzi z API pogodowego.");
    }

    const dayMap: Record<string, {
        temps: number[];
        humidities: number[];
        winds: number[];
        codes: number[];
    }> = {};

    data.hourly.time.forEach((timestamp: string, idx: number) => {
        const date = timestamp.split("T")[0];
        if (!dayMap[date]) {
            dayMap[date] = { temps: [], humidities: [], winds: [], codes: [] };
        }
        dayMap[date].temps.push(data.hourly.temperature_2m[idx]);
        dayMap[date].humidities.push(data.hourly.relative_humidity_2m[idx]);
        dayMap[date].winds.push(data.hourly.wind_speed_10m[idx]);
        dayMap[date].codes.push(data.hourly.weathercode[idx]);
    });

    const installationPower = 2.5;
    const efficiency = 0.2;

    return Object.entries(dayMap).map(([date, dayData], idx) => {
        const sunshineSeconds = data.daily.sunshine_duration[idx] ?? 0;
        const sunshineHours = sunshineSeconds / 3600;

        return {
            date,
            maxTemperature: Math.max(...dayData.temps),
            minTemperature: Math.min(...dayData.temps),
            humidity: Math.round(dayData.humidities.reduce((a, b) => a + b, 0) / dayData.humidities.length),
            windSpeed: parseFloat((dayData.winds.reduce((a, b) => a + b, 0) / dayData.winds.length).toFixed(1)),
            icon: mapWeatherCodeToIcon(dayData.codes[0]),
            generatedEnergy: parseFloat((installationPower * sunshineHours * efficiency).toFixed(2)),
        };
    });
};