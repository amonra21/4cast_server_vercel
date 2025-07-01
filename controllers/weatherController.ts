import { fetchWeatherData } from "../services/fetchWeatherData";

export const getWeather = async (req, res) => {
    try {
        const url = new URL(req.url, `https://${req.headers.host}`);
        const lat = url.searchParams.get("lat");
        const lon = url.searchParams.get("lon");

        if (!lat || !lon) {
            return res.status(400).json({ error: "Brakuje współrzędnych (lat i lon)" });
        }

        const data = await fetchWeatherData(parseFloat(lat), parseFloat(lon));
        return res.status(200).json(data);

    } catch (error) {
        console.error("Błąd:", error);
        return res.status(500).json({ error: "Błąd podczas pobierania danych pogodowych" });
    }
};