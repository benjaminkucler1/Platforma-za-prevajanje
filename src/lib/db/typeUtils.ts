import { type InferSelectModel } from "drizzle-orm";
import { userTable, fileTable, userFileTable, userLangTable, wordTable } from "./schema";

export type User = InferSelectModel<typeof userTable>;
export type File = InferSelectModel<typeof fileTable>;
export type UserFile = InferSelectModel<typeof userFileTable>;
export type UserLang = InferSelectModel<typeof userLangTable>;
export type Word = InferSelectModel<typeof wordTable>;
