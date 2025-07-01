import { Application } from "./deps.ts";
import weatherRoutes from "./routes/weatherRoutes.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";

const app = new Application();

app.use(oakCors());

app.use(weatherRoutes.routes());
app.use(weatherRoutes.allowedMethods());

console.log("Serwer pogodowy działa na http://localhost:8000");
await app.listen({ port: 8000 });