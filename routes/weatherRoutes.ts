import { Router } from "../deps.ts";
import { getWeather } from "../controllers/weatherController.ts";
import { getWeeklySummary } from "../controllers/weatherSummaryController.ts";

const router = new Router();

router.get("/getWeeklyForecast", getWeather);
router.get("/getWeeklySummary", getWeeklySummary);

export default router;