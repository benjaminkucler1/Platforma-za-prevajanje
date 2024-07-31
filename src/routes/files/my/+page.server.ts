import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
    abandonFile,
	deleteFile,
	deleteUserFileByFileId,
	deleteWordsByFileId,
	getFilesByOwner,
	getFilesByUserNormal,
	getUserIdByEmail,
	getUserTypeByEmail,
	insertFile,
	insertWords,
    setAbandonedDate
} from '$lib/db/queries';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zFileCreateSchema } from '$lib/validation/file';
import { withFiles } from 'sveltekit-superforms';
import { message, setError, fail } from 'sveltekit-superforms';
import { calculateProgress, concatWithDots, XMLParser } from '$lib/utils';
import type { UserFileIds, WordTranslateData } from '$lib/types/interfaces';
import * as deepl from 'deepl-node';
import { DEEPL_SECRET } from '$env/static/private';


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

	//owner's files data
	const userFiles = await getFilesByOwner(userId);
    //user obtained files data
    const userObtainedFiles = await getFilesByUserNormal(userId);

	return {
		form,
		normal,
		userFiles,
        userObtainedFiles
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
		const file = form.data.file as File;
		const content = await file.text();
		const words = XMLParser(content);
		let wordsForTranslation: WordTranslateData[] = []; 
		words.forEach(word => {
			let wf: WordTranslateData = {
				value: word.name,
				sourceLanguage: form.data.sourceLanguage,
				targetLanguage: form.data.targetLanguage
			}
			wordsForTranslation.push(wf);
		});
		translateWords(wordsForTranslation.length != 0 ? wordsForTranslation : undefined);
		
/*
		const progress = calculateProgress(words);
		form.data.progress = progress;
		const fileId = await insertFile(form.data);
		insertWords(words, fileId);
*/
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
			deleteUserFileByFileId(fileId);
			deleteFile(fileId);
		}
	},
    abandonFile: async ({ request, locals }) => {
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

            abandonFile(data.fileId);
            setAbandonedDate(data);
        }
    }
};


const translateWords = async (words?: WordTranslateData[]) => {
	if (words == undefined){
		return;
	}

	const translator = new deepl.Translator(DEEPL_SECRET);

	for (let i = 0; i < words.length; i += 3) {
		const chunk = words.slice(i, i + 3).map(word => word.value);
		
		let apiString = concatWithDots(chunk);
		console.log(apiString)
	  }

	//const result = await translator.translateText("WORD.VALUE", "en", "sl");
}
