import { eq } from "drizzle-orm";
import { db } from "./db.server";
import { userTable } from "./schema";
import { v4 as uuidv4 } from 'uuid';



export async function emailExists(email:string){
    const user = await db.query.userTable.findFirst({
        where: eq(userTable.email, email)
    });

    return user;
}

export async function getUserTypeByEmail(email: string){
    const result = await db.select({
        type: userTable.role
    })
    .from(userTable)
    .where(eq(userTable.email, email))
    .limit(1);
    
    return result[0];
}