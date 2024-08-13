import { redirect, type Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import {
    abandonFile,
	completeFile,
	deleteFile,
	deleteUserFileByFileId,
	deleteWordsByFileId,
	getFilesByOwner,
	getFilesByUserNormal,
	getUserIdByEmail,
	getUserTypeByEmail,
	improveUserRating,
	insertFile,
	insertWords,
    setAbandonedDate
} from '$lib/db/queries';
import { superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { zFileCreateSchema } from '$lib/validation/file';
import { withFiles } from 'sveltekit-superforms';
import { message, setError, fail } from 'sveltekit-superforms';
import { calculateProgress, concatWithDots, splitAndReplace, XMLParser } from '$lib/utils';
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

interface TranslationResult {
	text: string;
  }
  
  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
  
  const translateWords = async (words?: WordTranslateData[]): Promise<string[]> => {
	if (!words) {
	  return [];
	}
  
	const translator = new deepl.Translator(DEEPL_SECRET);
	let resultArray: string[] = [];
	const chunkSize = 3; // Number of words to translate in one request
	const delay = 1000; // Delay between API calls in milliseconds
	const timeout = 10000; // Timeout for API call in milliseconds
  
	const translateChunk = async (chunk: string[]): Promise<string[]> => {
	  try {
		const apiString = concatWithDots(chunk);
		console.log(`Translating chunk: ${apiString}`);
		const result = await Promise.race<TranslationResult>([
		  translator.translateText(apiString, null, "sl"),
		  new Promise<TranslationResult>((_, reject) =>
			setTimeout(() => reject(new Error("Request timeout")), timeout)
		  )
		]);
		console.log(`Translated text: ${result.text}`);
		return splitAndReplace(result.text);
	  } catch (error) {
		console.error("Error translating chunk:", chunk, error);
		return [];
	  }
	};
  
	for (let i = 0; i < words.length; i += chunkSize) {
	  const chunk = words.slice(i, i + chunkSize).map(word => word.value);
	  const splitResult = await translateChunk(chunk);
	  resultArray = resultArray.concat(splitResult);
	  await sleep(delay); // Delay to avoid rate limiting
	}
  
	console.log("Translation complete");
	return resultArray;
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
		const progress = calculateProgress(words);
		form.data.progress = progress;
		let wordsForTranslation: WordTranslateData[] = []; 
		words.forEach(word => {
			let wf: WordTranslateData = {
				value: word.name,
				sourceLanguage: form.data.sourceLanguage,
				targetLanguage: form.data.targetLanguage
			}
			wordsForTranslation.push(wf);
		});
		let translations = await translateWords(wordsForTranslation.length != 0 ? wordsForTranslation : undefined);
		for (let i = 0; i < words.length; i+=1){
			words[i].translation = translations[i];
		}
		
		const fileId = await insertFile(form.data);
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
    },
	completeFile: async ({ request }) => {
		const formData = await request.formData();
		const fileId = Number(formData.get('fileId'));
		const currentUserId = String(formData.get('currentUserId'));

		completeFile(fileId);
		if (currentUserId)
			improveUserRating(currentUserId, 1);
	}
};