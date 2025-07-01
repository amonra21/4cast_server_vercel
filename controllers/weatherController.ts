import { fetchWeatherData } from "../services/fetchWeatherData";

export const getWeather = async (req:any, res:any) => {
    try {
        const url = new URL(req.url, `https://${req.headers.host}`);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");

        if (!lat || !lon) {
            return res
                .setHeader("Access-Control-Allow-Origin", "*")
                .status(400)
                .json({ error: "Brakuje współrzędnych (lat i lon)" });
        }

        const data = await fetchWeatherData(parseFloat(lat), parseFloat(lon));

        return res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(200)
            .json(data);

    } catch (error) {
        console.error("Błąd:", error);
        return res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(500)
            .json({ error: "Błąd podczas pobierania danych pogodowych" });
    }
};