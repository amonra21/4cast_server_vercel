import { Context } from "../deps";
import { fetchWeatherData } from "../services/fetchWeatherData";

export async function getWeather(req:any, res:any) {
    try {
        console.log("req.url:", req.url);
        console.log("req.headers:", req.headers);

        const url = new URL(req.url, `https://${req.headers.host}`);
        console.log("full URL:", url.href);

        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");

        if (!lat || !lon) {
            return res.status(400).json({
                error: "Brakuje współrzędnych (lat i lon)"
            });
        }

        // Tutaj możesz wywołać swoje fetchWeatherData()
        return res.status(200).json({
            ok: true,
            lat,
            lon
        });

    } catch (err) {
        console.error("Błąd:", err);
        return res.status(500).json({
            error: "Coś padło",
            details: err.message
        });
    }
}