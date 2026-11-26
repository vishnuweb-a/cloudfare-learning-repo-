import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import type { AppEnv } from "./types/env";
import userRoutes from "./routes/user.routes";
import { authMiddleware } from "./middleware/auth.middleware";
import aiRoutes from "./routes/ai.routes";
const app = new Hono<AppEnv>();


// Middleware
app.use("*", logger());
app.use("*", cors());

// Home route
app.get("/", (c) => {
    return c.json({
        message: "Cloudflare Backend Running"
    });
});

// Register routes
app.route("/api/users", userRoutes);
app.use("/api/users", authMiddleware);
// config routes 
app.get("/api/config", (c) => {
    return c.json({
        name: c.env.APP_NAME,
        version: c.env.APP_VERSION,
        environment: c.env.APP_ENV
    });
});
app.route("/api/users", userRoutes);
app.route("/api/ai", aiRoutes);
// Error handling
app.notFound((c) => {
    return c.json({
        message: "Route not found"
    }, 404);
});

app.onError((err, c) => {
    console.error(err);

    return c.json({
        message: "Internal server error"
    }, 500);
});

export default app;