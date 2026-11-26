import { Hono } from "hono";
import type { AppEnv } from "../types/env";
import { chat } from "../controllers/ai.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const aiRoutes = new Hono<AppEnv>();

aiRoutes.use("*", authMiddleware);

aiRoutes.post("/chat", chat);

export default aiRoutes;