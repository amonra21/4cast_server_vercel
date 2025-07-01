import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fetchWeeklySummary } from "../services/fetchWeeklySummary.ts";

Deno.test("fetchWeeklySummary obsługuje poprawne dane", async () => {
    globalThis.fetch = (_input: RequestInfo | URL) => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            daily: {
                temperature_2m_max: [25, 26, 27],
                temperature_2m_min: [15, 16, 17],
                precipitation_sum: [0, 0, 5],
                sunshine_duration: [14400, 18000, 21600] // 4h, 5h, 6h
            },
            hourly: {
                pressure_msl: [1010, 1011, 1012]
            }
        }),
    } as Response);

    const summary = await fetchWeeklySummary(52, 21);
    assertEquals(summary.minTemperature, 15);
    assertEquals(summary.maxTemperature, 27);
    assertEquals(summary.summaryComment, "bez opadów");
    assertEquals(summary.averageSunExposition, 5.0);
});

Deno.test("fetchWeeklySummary obsługuje błąd API", async () => {
    globalThis.fetch = (_input: RequestInfo | URL) => Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Internal Server Error")
    } as Response);

    await assertRejects(
        () => fetchWeeklySummary(52, 21),
        Error,
        "Błąd API pogodowego"
    );
});
