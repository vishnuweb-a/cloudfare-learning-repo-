export async function getUsers(db: D1Database) {
    const result = await db
        .prepare("SELECT * FROM users ORDER BY id LIMIT 100")
        .all();

    return result.results;
}

export async function getUserById(
    db: D1Database,
    id: number
) {
    const user = await db
        .prepare("SELECT * FROM users WHERE id = ?")
        .bind(id)
        .first();

    return user;
}

export async function createUser(
    db: D1Database,
    name: string,
    email: string
) {
    return await db
        .prepare(
            "INSERT INTO users (name, email) VALUES (?, ?)"
        )
        .bind(name, email)
        .run();
}


export async function updateUser(
    db: D1Database,
    id: number,
    name: string,
    email: string
) {
    return await db
        .prepare(
            "UPDATE users SET name = ?, email = ? WHERE id = ?"
        )
        .bind(name, email, id)
        .run();
}

export async function deleteUser(
    db: D1Database,
    id: number
) {
    return await db
        .prepare("DELETE FROM users WHERE id = ?")
        .bind(id)
        .run();
}

