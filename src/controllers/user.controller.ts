import type { Context } from "hono";
import type { AppEnv } from "../types/env";

import * as userService from "../services/user.service";

export async function getAllUsers(c: Context<AppEnv>) {

    const users = await userService.getUsers(c.env.DB);

    return c.json(users);
}

export async function getSingleUser(c: Context<AppEnv>) {

    const id = Number(c.req.param("id"));

    if (!Number.isSafeInteger(id) || id <= 0) {
        return c.json({
            message: "Invalid user ID"
        }, 400);
    }

    const user = await userService.getUserById(c.env.DB, id);

    if (!user) {
        return c.json({
            message: "User not found"
        }, 404);
    }

    return c.json(user);
}

export async function createUser(c: Context<AppEnv>) {

    const body = await c.req.json().catch(() => null);

    if (
        !body ||
        typeof body.name !== "string" ||
        !body.name.trim() ||
        typeof body.email !== "string" ||
        !body.email.includes("@")
    ) {
        return c.json({
            message: "Invalid name or email"
        }, 400);
    }

    const result = await userService.createUser(
        c.env.DB,
        body.name.trim(),
        body.email.trim()
    );

    return c.json({
        message: "User created successfully",
        id: result.meta.last_row_id
    }, 201);
}

export async function updateUser(c: Context<AppEnv>) {

    const id = Number(c.req.param("id"));
    const body = await c.req.json().catch(() => null);

    if (
        !Number.isSafeInteger(id) ||
        id <= 0 ||
        !body ||
        typeof body.name !== "string" ||
        !body.name.trim() ||
        typeof body.email !== "string" ||
        !body.email.includes("@")
    ) {
        return c.json({
            message: "Invalid input"
        }, 400);
    }

    const result = await userService.updateUser(
        c.env.DB,
        id,
        body.name.trim(),
        body.email.trim()
    );

    if (!result.meta.changes) {
        return c.json({
            message: "User not found"
        }, 404);
    }

    return c.json({
        message: "User updated successfully"
    });
}
export async function deleteUser(c: Context<AppEnv>) {

    const id = Number(c.req.param("id"));

    if (!Number.isSafeInteger(id) || id <= 0) {
        return c.json({
            message: "Invalid user ID"
        }, 400);
    }

    const result = await userService.deleteUser(
        c.env.DB,
        id
    );

    if (!result.meta.changes) {
        return c.json({
            message: "User not found"
        }, 404);
    }

    return c.json({
        message: "User deleted successfully"
    });
}