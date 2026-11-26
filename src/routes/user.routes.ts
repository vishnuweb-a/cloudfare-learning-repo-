import { Hono } from "hono";
import type { AppEnv } from "../types/env";

import * as controller from "../controllers/user.controller";
import { authMiddleware } from "../middleware/auth.middleware";

const userRoutes = new Hono<AppEnv>();

userRoutes.use("*", authMiddleware);

userRoutes.get("/", controller.getAllUsers);
userRoutes.get("/:id", controller.getSingleUser);
userRoutes.post("/", controller.createUser);
userRoutes.put("/:id", controller.updateUser);
userRoutes.delete("/:id", controller.deleteUser);

export default userRoutes;