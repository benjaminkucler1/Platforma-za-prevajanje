import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
	deleteFile,
	deleteWordsByFileId,
	getFilesByOwner,
	getUserIdByEmail,
	getUserTypeByEmail,
	insertFile,
	insertWords
} from '$lib/db/queries';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zFileCreateSchema } from '$lib/validation/file';
import { withFiles } from 'sveltekit-superforms';
import { message, setError, fail } from 'sveltekit-superforms';
import { XMLParser } from '$lib/utils';


const isNormal = async (email: string) => {
	const userRole = await getUserTypeByEmail(email);
	return userRole.type == 'normal';
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth();
	if (!session) redirect(303, '/login');
	const email: string = session!.user!.email!;
	const userId: string = await getUserIdByEmail(email);

	const normal: boolean = await isNormal(email);

	const form = await superValidate(zod(zFileCreateSchema));

	//user's files data
	const userFiles = await getFilesByOwner(userId);

	return {
		form,
		normal,
		userFiles
	};
};

export const actions: Actions = {
	addFile: async (event) => {
		const session = await event.locals.auth();
		const email: string = session!.user!.email!;
		const id: string = await getUserIdByEmail(email);

		const form = await superValidate(event, zod(zFileCreateSchema));
		form.data.createdBy = id;

		console.log(form.data);
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}
		if (form.data.name == '') {
			form.data.name = form.data.file.name;
		}

		const fileId = await insertFile(form.data);

		//console.log(form.data.file);
		const file = form.data.file as File;
		const content = await file.text();
		const words = XMLParser(content);
		console.log(words);
		insertWords(words, fileId);

		//return message(form, 'Posted OK!');
		//return setError(form, 'file', 'Could not process file');

		return withFiles({ form });
	},
	removeFile: async ({ request }) => {
		const formData = await request.formData();
		const fileId = Number(formData.get('fileId'));

		if (fileId) {
            console.log(fileId);
			deleteWordsByFileId(fileId);
			deleteFile(fileId);
		}
	}
};