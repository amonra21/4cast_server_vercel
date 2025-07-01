import { getWeather } from "../controllers/weatherController.ts";

export default async function handler(req: Request): Promise<Response> {
    return await getWeather(req);
}