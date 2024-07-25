import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async (event) => {
    return {
        session: await event.locals.auth()
    }
}