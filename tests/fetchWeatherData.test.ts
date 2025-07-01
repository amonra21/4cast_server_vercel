import { assertEquals, assertRejects } from "https://deno.land/std@0.224.0/assert/mod.ts";
import { fetchWeatherData } from "../services/fetchWeatherData.ts";

Deno.test("fetchWeatherData - poprawnie przelicza dane", async () => {
    globalThis.fetch = (_input: RequestInfo | URL) => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
            hourly: {
                time: ["2025-07-01T12:00", "2025-07-01T13:00"],
                temperature_2m: [20, 22],
                relative_humidity_2m: [50, 52],
                wind_speed_10m: [5, 6],
                weathercode: [1, 1],
            },
            daily: {
                sunshine_duration: [14400] // 4h
            }
        }),
    } as Response);

    const result = await fetchWeatherData(52, 21);
    assertEquals(result.length, 1);
    assertEquals(result[0].maxTemperature, 22);
    assertEquals(result[0].humidity, 51);
    assertEquals(result[0].generatedEnergy, 2.0);
});

Deno.test("fetchWeatherData - obsługuje błąd API", async () => {
    globalThis.fetch = (_input: RequestInfo | URL) => Promise.resolve({
        ok: false,
        text: () => Promise.resolve("Internal Server Error")
    } as Response);

    await assertRejects(
        () => fetchWeatherData(52, 21),
        Error,
        "Błąd API pogodowego"
    );
});
