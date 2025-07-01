import { Context } from "../deps";
import { fetchWeatherData } from "../services/fetchWeatherData";

export async function getWeather(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    if (!lat || !lon) {
        return new Response(
            JSON.stringify({ error: "Brakuje współrzędnych (lat i lon)" }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const data = await fetchWeatherData(parseFloat(lat), parseFloat(lon));
        return new Response(
            JSON.stringify(data),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (error) {
        return new Response(
            JSON.stringify({ error: "Błąd podczas pobierania danych pogodowych" }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
}