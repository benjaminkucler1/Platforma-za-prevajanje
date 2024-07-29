import { type InferSelectModel } from "drizzle-orm";
import { userTable, fileTable, userFileTable, userLangTable, wordTable } from "./schema";

export type TUser = InferSelectModel<typeof userTable>;
export type TFile = InferSelectModel<typeof fileTable>;
export type TUserFile = InferSelectModel<typeof userFileTable>;
export type TUserLang = InferSelectModel<typeof userLangTable>;
export type TWord = InferSelectModel<typeof wordTable>;