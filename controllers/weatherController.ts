import { Context } from "../deps";
import { fetchWeatherData } from "../services/fetchWeatherData";

export const getWeather = async (ctx: Context) => {
    const url = new URL(ctx.request.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    if (!lat || !lon) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Brakuje współrzędnych (lat i lon)" };
        return;
    }

    try {
        const data = await fetchWeatherData(parseFloat(lat), parseFloat(lon));
        ctx.response.status = 200;
        ctx.response.body = data;
    } catch (error) {
        ctx.response.status = 500;
        ctx.response.body = { error: "Błąd podczas pobierania danych pogodowych" };
    }
};