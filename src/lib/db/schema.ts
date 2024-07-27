import { primaryKey, pgTable, pgEnum, serial, text, varchar, boolean, integer, timestamp, date } from "drizzle-orm/pg-core";
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { AdapterAccountType } from "@auth/core/adapters";
import type { LanguageEnum, UserStatusEnum, FileStatusEnum, UserFileStatusEnum, UserTypeEnum } from "$lib/types/enums.ts";

export const languageEnum = pgEnum('language', ['si', 'en', 'de', 'it']); // todo
export const userStatusEnum = pgEnum('status', ['novice', 'intermediate', 'expert']);
export const fileStatusEnum = pgEnum('status', ['waiting', 'in_review', 'completed']);
export const userFileStatusEnum = pgEnum('status', ['in_progress', 'abandoned', 'in_review', 'completed']);
//export const providerEnum = pgEnum('provider', ['google', 'github']);
export const userTypeEnum = pgEnum('userType', ['admin', 'normal', 'client']) // todo POPRAVI

export const userTable = pgTable("user", {
    id: text("id").primaryKey(),
    email: text("email").notNull().unique(),
    emailVerified: timestamp("emailVerified", {mode: "date"}),
    image: text("image"),
    name: text("name"),
    phone: varchar("phone", {length: 10}),
    street: varchar("street", {length: 255}),
    postnumber: integer("postnumber"),
    city: varchar("city", {length: 255}),
    school: varchar("school", {length: 128}),
    birthday: date('birthday', { mode: "string" }),
    status: userStatusEnum("status"),
    firstLang: languageEnum('language'),
    rating: integer("rating"),
    role: userTypeEnum("userType").default('normal'),
    emptySettings: boolean("emptySettings").default(true)
});

export const accountTable = pgTable("account",{
      userId: text("userId")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
      type: text("type").$type<AdapterAccountType>().notNull(),
      provider: text("provider").notNull(),
      providerAccountId: text("providerAccountId").notNull(),
      refresh_token: text("refresh_token"),
      access_token: text("access_token"),
      expires_at: integer("expires_at"),
      token_type: text("token_type"),
      scope: text("scope"),
      id_token: text("id_token"),
      session_state: text("session_state"),
    }, 
    (account) => {
        return{
            pk: primaryKey({columns: [account.provider, account.providerAccountId]}),
        };
    });

export const fileTable = pgTable("file", {
    id: serial("id").primaryKey(),
    langFrom: languageEnum("language").notNull(),
    langTo: languageEnum("language").notNull(),
    currentUserId: text("currentUserId").references(() => userTable.id).notNull(),
    obtainable: boolean("obtainable").notNull(),
    progress: integer("progress").notNull(),
    status: fileStatusEnum("status").notNull(),
    createdBy: text("CreatedByUserId").references(() => userTable.id).notNull(),
    createdOn: timestamp("createdOn").notNull()
});

export const userLangTable = pgTable("userLang", {
    userId: text("userId").references(() => userTable.id),
    lang: languageEnum("language")
    },
    (userLang) => {
        return{
            pk: primaryKey({columns: [userLang.userId, userLang.lang]})
        }
    }
);

export const userFileTable = pgTable("userFile", {
    userId: text("userId").references(() => userTable.id),
    fileId: integer("fileId").references(() => fileTable.id),
    status: userFileStatusEnum("status").notNull(),
    abandonedOn: timestamp("abandonedOn")
    },
    (userFile) => {
        return{
            pk: primaryKey({columns: [userFile.userId, userFile.fileId]})
        }
    }    
);

export const wordTable = pgTable("word", {
    id: serial("id").primaryKey(),
    originalWord: varchar("originalWord", {length: 64}).notNull(),
    translatedWord: varchar("translatedWord", {length: 64}),
    fileId: integer("fileId").references(() => fileTable.id).notNull(),
    reviewRequired: boolean("reviewRequired").default(false),
    currentLDistance: integer("currentLDistance")
});

export const sessionTable = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => userTable.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  });

export const verificationTokenTable = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (verificationToken) => ({
        pk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
        }),
    })
);

export const authenticatorTable = pgTable(
    "authenticator",
    {
      credentialID: text("credentialID").notNull().unique(),
      userId: text("userId")
        .notNull()
        .references(() => userTable.id, { onDelete: "cascade" }),
      providerAccountId: text("providerAccountId").notNull(),
      credentialPublicKey: text("credentialPublicKey").notNull(),
      counter: integer("counter").notNull(),
      credentialDeviceType: text("credentialDeviceType").notNull(),
      credentialBackedUp: boolean("credentialBackedUp").notNull(),
      transports: text("transports"),
    },
    (authenticator) => ({
      pk: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    })
  )