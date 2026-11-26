import { Hono } from "hono";

import {
    getAllUsers,
    getSingleUser
} from "../controllers/user.controller";

const userRoutes = new Hono();

userRoutes.get("/", getAllUsers);
userRoutes.get("/:id", getSingleUser);

export default userRoutes;