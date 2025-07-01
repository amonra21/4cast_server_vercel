import { Context } from "../deps.ts";
import { fetchWeeklySummary } from "../services/fetchWeeklySummary.ts";

export const getWeeklySummary = async (ctx: Context) => {
    const url = new URL(ctx.request.url);
    const lat = url.searchParams.get("lat");
    const lon = url.searchParams.get("lon");

    if (!lat || !lon) {
        ctx.response.status = 400;
        ctx.response.body = { error: "Brakuje współrzędnych (lat i lon)" };
        return;
    }

    try {
        const data = await fetchWeeklySummary(parseFloat(lat), parseFloat(lon));
        ctx.response.status = 200;
        ctx.response.body = data;
    } catch (err) {
        console.error(err);
        ctx.response.status = 500;
        ctx.response.body = { error: "Błąd podczas przygotowywania podsumowania tygodnia" };
    }
};