// db for user query stuff?

import { getRequest } from "@tanstack/react-start/server";
import { auth } from "./db/auth";
import { createServerFn } from "@tanstack/react-start";


export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
    const session = await auth.api.getSession({
        headers: getRequest().headers,
    });

    return session?.user ?? null;
});

export function GetAllUsers() {

}