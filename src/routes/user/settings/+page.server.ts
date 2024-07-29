import { superValidate } from "sveltekit-superforms";
import { zUserProfileSchema } from "$lib/validation/user.js";
import { zod } from "sveltekit-superforms/adapters";
import { getUserDataByEmail, getUserTypeByEmail, updateUserData } from "$lib/db/queries.js";
import { redirect, type Actions } from "@sveltejs/kit";
import { fail } from "@sveltejs/kit";
import type { UserDataUpdate } from "$lib/types/interfaces.js";
import type { PageServerLoad } from "../$types";

const isNormal = async (email: string)=>{
  const userRole = await getUserTypeByEmail(email);
  return userRole.type == "normal";
}

export const load: PageServerLoad = async (event) => {
    const session = await event.locals.auth();

    if (!session?.user) redirect(303, "/login");
    const email: string = session!.user!.email!;

    const normal: boolean = await isNormal(email);

    const userData: UserDataUpdate = await getUserDataByEmail(email);

    const form = await superValidate(zod(zUserProfileSchema));
    form.data = userData;

  return {
    form,
    normal 
  };
};

export const actions: Actions = {
  default: async (event) => {
    const session = await event.locals.auth();
    const email: string = session!.user!.email!;

    const form = await superValidate(event, zod(zUserProfileSchema));
    console.log(form.data);
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    updateUserData(email, form.data)
    return {
      form
    };
  },
};