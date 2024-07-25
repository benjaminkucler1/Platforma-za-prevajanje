import { z } from "zod";
import { languageEnum, userStatusEnum } from "$lib/db/schema";

export const zUserProfileSchema = z.object({
    name: z.string().min(2, {message: "Name should contains at least 2 characters"}),
    phone: z.string().regex(/^\+?[0-9]{1,12}$/, {message: "Invalid phone number"}),
    street: z.string(),
    postnumber: z.number(),
    city: z.string(),
});
export const zUserNormalProfileSchema = zUserProfileSchema.extend({
    school: z.string().min(2, {message: "School should contains at least 2 characters"}),
    birthday: z.date(),
    firstLang: z.enum(languageEnum.enumValues)
});

export type zUserProfileSchema = typeof zUserProfileSchema;
export type zUserNormalProfileSchema = typeof zUserNormalProfileSchema;