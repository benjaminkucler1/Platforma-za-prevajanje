import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import Credentials from "@auth/sveltekit/providers/credentials";
import { GITHUB_ID, GITHUB_SECRET } from "$env/static/private";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "$lib/db/db.server";
import { accountTable, sessionTable, userTable, verificationTokenTable } from "$lib/db/schema";
import credentials from "@auth/sveltekit/providers/credentials";
import { saltAndHashPassword } from "$lib/utils/password";
import { getUserFromDb } from "$lib/db/queries";

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET}),
        Credentials({
            credentials: {
                email: {},
                password: {},
            },
            authorize: async (credentials) => {
                let user = null;
                const pwHash = await saltAndHashPassword(credentials.password as string);

                user = await getUserFromDb(credentials.email as string, pwHash)
            
                if (!user) {
                    throw new Error("User not found.")
                }

                return user;
            }
        })
    ]
});