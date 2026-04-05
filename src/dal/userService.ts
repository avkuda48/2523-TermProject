// db for user query stuff?

import type { User } from "#/types";

export function CreateNewUser(name: string, email: string, password: string){ //uses User type?

}

export function LoginUser(email: string, password:string ){ //uses User type?

}

export function GetUser(userId: number | string){
    Number(userId)
    const user = {}
    return user;
}

export function GetAllUsers(){

}