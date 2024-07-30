import { LanguageSourceEnum, LanguageTargetEnum } from "$lib/types/enums";
import { getEnumValues } from "$lib/utils";
import { z } from "zod";

export const zFileCreateSchema = z.object({
    name: z.string(),
    sourceLanguage: z.enum(getEnumValues(LanguageSourceEnum)),
    targetLanguage: z.enum(getEnumValues(LanguageTargetEnum)),
    createdBy: z.string(),
    file: z.instanceof(File, { message: "Upload a file"}),
    progress: z.number().optional()
})

export type ZFileCreateSchema = typeof zFileCreateSchema;