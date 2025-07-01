import { WeeklySummary } from "../models/weeklySummary.ts";

export const fetchWeeklySummary = async (lat: number, lon: number): Promise<WeeklySummary> => {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}` +
        `&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,sunshine_duration` +
        `&hourly=pressure_msl&timezone=auto`;

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error("Błąd API pogodowego");
    }

    const data = await response.json();

    if (
        !data.daily || !data.hourly ||
        ![data.daily.temperature_2m_max, data.daily.temperature_2m_min, data.daily.precipitation_sum, data.daily.sunshine_duration]
            .every(Array.isArray) ||
        !Array.isArray(data.hourly.pressure_msl)
    ) {
        throw new Error("Nieprawidłowy format odpowiedzi z API pogodowego");
    }

    const dailyLength = data.daily.temperature_2m_max.length;
    if (
        [data.daily.temperature_2m_min, data.daily.precipitation_sum, data.daily.sunshine_duration]
            .some(arr => arr.length !== dailyLength) || dailyLength === 0
    ) {
        throw new Error("Nieprawidłowe długości danych dziennych w odpowiedzi z API pogodowego.");
    }

    const hourlyLength = data.hourly.pressure_msl.length;
    if (hourlyLength === 0) {
        throw new Error("Brak danych godzinowych w odpowiedzi z API pogodowego.");
    }

    const avgPressure = parseFloat(
        (data.hourly.pressure_msl.reduce((a: any, b: any) => a + b, 0) / hourlyLength).toFixed(2)
    );

    const avgSunHours = parseFloat(
        (data.daily.sunshine_duration.reduce((a: any, b: any) => a + b, 0) / dailyLength / 3600).toFixed(2)
    );

    const minTemp = Math.min(...data.daily.temperature_2m_min);
    const maxTemp = Math.max(...data.daily.temperature_2m_max);

    const daysWithRain = data.daily.precipitation_sum.filter((v: number) => v > 0).length;
    const summary = daysWithRain >= Math.ceil(dailyLength / 2) ? "z opadami" : "bez opadów";

    return {
        date: new Date().toISOString().split("T")[0],
        averageSunExposition: avgSunHours,
        minTemperature: minTemp,
        maxTemperature: maxTemp,
        summaryComment: summary,
    };
};
