import { fetchWeeklySummary } from "../services/fetchWeeklySummary";

export const getWeeklySummary = async (req, res) => {
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

        const data = await fetchWeeklySummary(parseFloat(lat), parseFloat(lon));

        return res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(200)
            .json(data);

    } catch (err) {
        console.error("Błąd w getWeeklySummary:", err);
        return res
            .setHeader("Access-Control-Allow-Origin", "*")
            .status(500)
            .json({ error: "Błąd podczas przygotowywania podsumowania tygodnia" });
    }
};