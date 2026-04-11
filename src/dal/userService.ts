// db for user query stuff?

import type { User } from "#/types";
import { getRequest } from "@tanstack/react-start/server";
import { auth } from "./db/auth";
import { createServerFn } from "@tanstack/react-start";

export function CreateNewUser(name: string, email: string, password: string) { //uses User type?

}

export function LoginUser(email: string, password: string) { //uses User type?

}

export const getCurrentUser = createServerFn({ method: "GET" }).handler(async () => {
    const session = await auth.api.getSession({
        headers: getRequest().headers,
    });

    return session?.user ?? null;
});

export function GetAllUsers() {

}