import { SvelteKitAuth } from "@auth/sveltekit";
import GitHub from "@auth/sveltekit/providers/github";
import { GITHUB_ID, GITHUB_SECRET, GOOGLE_ID, GOOGLE_SECRET,
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASSWORD,
    EMAIL_FROM
 } from "$env/static/private";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "$lib/db/db.server";
import Nodemailer from "@auth/sveltekit/providers/nodemailer";
import Google from "@auth/core/providers/google";

export const { handle, signIn, signOut } = SvelteKitAuth({
    adapter: DrizzleAdapter(db),
    providers: [
        GitHub({ clientId: GITHUB_ID, clientSecret: GITHUB_SECRET}),
        Google({ clientId: GOOGLE_ID, clientSecret: GOOGLE_SECRET}),
        Nodemailer({
            server: {
                host: SMTP_HOST,
                port: Number(SMTP_PORT),
                auth: {
                  user: SMTP_USER,
                  pass: SMTP_PASSWORD
                }
              },
              from: EMAIL_FROM
        })
    ],
    pages: {
        signIn: "/login",
        signOut: "/login"
    }
});