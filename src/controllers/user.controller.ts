import type { Context } from "hono";
import { getUsers, getUserById } from "../services/user.service";

export function getAllUsers(c: Context) {
    return c.json(getUsers());
}

export function getSingleUser(c: Context) {
    const id = Number(c.req.param("id"));
    const user = getUserById(id);

    if (!user) {
        return c.json({
            message: "User not found"
        }, 404);
    }

    return c.json(user);
}
