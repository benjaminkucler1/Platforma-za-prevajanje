import { z } from "zod";
import { LanguageTargetEnum } from "$lib/types/enums";
import { getEnumValues } from "$lib/utils";


export const zUserProfileSchema = z.object({
    name: z.string().min(2, {message: "Name should contains at least 2 characters"}),
    phone: z.string().optional().refine(value => {
        if (value === undefined || value === '') {
            return true;
        }
        return /^\+?[0-9]{1,12}$/.test(value);
    }, {
        message: "Invalid phone number"
    }),
    street: z.string().optional(),
    postnumber: z.string().optional(),
    city: z.string().optional(),
    school: z.string().optional().refine(value => {
        if (value === undefined || value === '') {
            return true; 
        }
        return value.length >= 2;
    }, {
        message: "School should contain at least 2 characters"
    }),
    birthday: z.string().optional(),
    firstLanguage: z.enum(getEnumValues(LanguageTargetEnum)).optional()
});

export type ZUserProfileSchema = typeof zUserProfileSchema;