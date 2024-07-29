import { LanguageEnum } from "$lib/types/enums";
import { getEnumValues } from "$lib/utils";
import { z } from "zod";

export const zFileCreateSchema = z.object({
    name: z.string(),
    langFrom: z.enum(getEnumValues(LanguageEnum)),
    langTo: z.enum(getEnumValues(LanguageEnum)),
    createdBy: z.string(),
    file: z.instanceof(File, { message: "Upload a file"})
})

export type ZFileCreateSchema = typeof zFileCreateSchema;