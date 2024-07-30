import { type InferSelectModel } from "drizzle-orm";
import { userTable, fileTable, userFileTable, userLangTable, wordTable } from "./schema";

export type UserType = InferSelectModel<typeof userTable>;
export type FileType = InferSelectModel<typeof fileTable>;
export type UserFileType = InferSelectModel<typeof userFileTable>;
export type UserLangType = InferSelectModel<typeof userLangTable>;
export type WordType = InferSelectModel<typeof wordTable>;