import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { userTable } from "./schema";
import { comparePassword } from "$lib/utils/password";
import { v4 as uuidv4 } from 'uuid';

export async function getUserFromDb(email: string, password: string){
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email)
    });

    return (user && await comparePassword(password, user.hashedPassword as string)) ? user : null;
}

export async function emailExists(email:string){
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email)
    });

    return user;
}

export async function registerUser(email:string, hashedPassword: string, name: string){
    await db.insert(userTable).values({
        id: uuidv4(),
        name: name,
        email: email,
        hashedPassword: hashedPassword
    });
}