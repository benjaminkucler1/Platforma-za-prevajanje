import { getObtainableFiles, getUserIdByEmail, getUserTypeByEmail, insertUserFile, obtainFile } from "$lib/db/queries";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import type { UserFileIds } from "$lib/types/interfaces";

const isNormal = async (email: string) => {
	const userRole = await getUserTypeByEmail(email);
	return userRole.type == 'normal';
};

export const load: PageServerLoad = async ({locals}) => {
    const session = await locals.auth();
	if (!session) redirect(303, '/login');
	const email: string = session!.user!.email!;
	const userId: string = await getUserIdByEmail(email);

	const normal: boolean = await isNormal(email); 

    const obtainableFiles = await getObtainableFiles();

    return {
        normal,
        obtainableFiles
    };
};

export const actions: Actions = {
    obtainFile: async ({locals, request}) => {
        const session = await locals.auth();
		const email: string = session!.user!.email!;
		const userId: string = await getUserIdByEmail(email);
        const formData = await request.formData();
        const fileId = Number(formData.get('fileId'));

        if(userId && fileId){
            const data: UserFileIds = {
                fileId: fileId,
                userId: userId
            }
            obtainFile(data);
            insertUserFile(data);
        }
        else{
            console.log("ERROR: Cannot obtain file");
            return fail(500);
        }
    }
}