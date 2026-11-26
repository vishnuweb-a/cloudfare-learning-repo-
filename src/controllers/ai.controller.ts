import type { Context } from "hono";
import type { AppEnv } from "../types/env";
import { generateResponse } from "../services/ai.service";

export async function chat(c: Context<AppEnv>) {

    const body = await c.req.json().catch(() => null);

    if (
        !body ||
        typeof body.prompt !== "string" ||
        !body.prompt.trim() ||
        body.prompt.length > 2000
    ) {
        return c.json({
            message: "Invalid prompt"
        }, 400);
    }

    const result = await generateResponse(
        c.env.AI,
        body.prompt
    );

    return c.json({
        success: true,
        result: result
    });
}