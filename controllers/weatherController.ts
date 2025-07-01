import { Context } from "../deps";
import { fetchWeatherData } from "../services/fetchWeatherData";

export async function getWeather(req: Request): Promise<Response> {
    try {
        console.log("req.url:", req.url);
        console.log("req.headers.get('host'):", req.headers.get("host"));

        const url = new URL(req.url, `https://${req.headers.get("host")}`);

        console.log("full URL:", url.href);

        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");

        if (!lat || !lon) {
            return new Response(JSON.stringify({
                error: "Brakuje współrzędnych (lat i lon)"
            }), {
                status: 400,
                headers: { "Content-Type": "application/json" }
            });
        }

        return new Response(JSON.stringify({
            ok: true,
            lat, lon
        }), {
            headers: { "Content-Type": "application/json" }
        });

    } catch (err) {
        console.error("Błąd:", err);
        return new Response(JSON.stringify({
            error: "Coś padło",
            details: err.message
        }), {
            status: 500,
            headers: { "Content-Type": "application/json" }
        });
    }
}