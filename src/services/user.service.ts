export function getUsers() {
    return [
        { id: 1, name: "Aman" },
        { id: 2, name: "Rahul" },
        { id: 3, name: "Rohit" }
    ];
}

export function getUserById(id: number) {
    return getUsers().find(user => user.id === id);
}