import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getUserEmptySettings } from '$lib/db/queries';

export const load: LayoutServerLoad = async (event) => {
    const session = await event.locals.auth();
    return {
        session
    };
};