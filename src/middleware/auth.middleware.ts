import { createMiddleware } from "hono/factory";
import type { AppEnv } from "../types/env";

export const authMiddleware = createMiddleware<AppEnv>(
    async (c, next) => {

        const apiKey = c.req.header("x-api-key");

        if (!c.env.API_KEY || apiKey !== c.env.API_KEY) {
            return c.json({
                message: "Unauthorized"
            }, 401);
        }

        await next();
    }
);
