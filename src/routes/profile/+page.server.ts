import type { PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { zUserProfileSchema, zUserNormalProfileSchema } from "$lib/validation/user.js";
import { zod } from "sveltekit-superforms/adapters";
import { getUserTypeByEmail } from "$lib/db/queries.js";
 
export const load: PageServerLoad = async (event) => {
    //let session = await event.locals.auth();

    //let userRole = getUserTypeByEmail(session?.user?.email?)
  return {
    //form: await superValidate(zod(formSchema)),
    name: "joze"
  };
};