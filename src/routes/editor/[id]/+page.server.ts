import { confirmWord, getUserIdByEmail, getUserTypeByEmail, getWordsByFileId, updateProgress, updateWords } from "$lib/db/queries";
import { redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { superValidate } from "sveltekit-superforms";
import { zod } from "sveltekit-superforms/adapters";
import { zWordIdSchema, zWordsSchema } from "$lib/validation/word";
import type { WordValues } from "$lib/types/interfaces";
import { checkWords } from "$lib/securityCheck";
import type { WordType } from "$lib/db/typeUtils";
import { calculateProgress } from "$lib/utils";

const isNormal = async (email: string) => {
	const userRole = await getUserTypeByEmail(email);
	return userRole.type == 'normal';
};

export const load: PageServerLoad = async ({ locals, params }) => {
    const session = await locals.auth();
	if (!session) redirect(303, '/login');
	const email: string = session!.user!.email!;
	const userId: string = await getUserIdByEmail(email);
	const normal: boolean = await isNormal(email);
    const fileId = parseInt(params.id);

    const words = await getWordsByFileId(fileId);
    const sanitizedWords = words.map(word => ({
        ...word,
        value: word.value ?? "",
        reviewRequired: word.reviewRequired ?? false,
        reviewed: word.reviewed ?? false,
        forbidden: word.forbidden ?? false,
        translation: word.translation ?? ""
    }));

    const form = await superValidate({ words: sanitizedWords }, zod(zWordsSchema));

    return {
        form,
        normal
    };
};


export const actions: Actions = {
    saveWords: async (event) => {
        const session = await event.locals.auth();
		const email: string = session!.user!.email!;

        const form = await superValidate(event, zod(zWordsSchema));

        const words: WordType[] = form.data.words.map(word =>({
            id: word.id,
            name: word.name,
            value: word.value ?? "",
            fileId: word.fileId,
            reviewRequired: word.reviewRequired,
            reviewed: word.reviewed,
            forbidden: word.forbidden,
            translation: word.translation ?? ""
        }));

        const forbiddenWords = ["drek", "gej"];

        const checkedWords = checkWords(words, forbiddenWords, 4);
        let w: WordValues[] = [];
        for(let i = 0; i <checkedWords.length; i+=1){
            let word: WordValues = {
                name: checkedWords[i].name,
                value: checkedWords[i].value ?? ""
            }
        }
        const progress = calculateProgress(w);
        updateProgress(checkedWords[0].fileId, progress);

        updateWords(checkedWords);
    },
    confirmWord: async ({locals, request}) =>{
        const formData = await request.formData();
        const wordId = Number(formData.get('wordId'));
        await confirmWord(wordId);
    }
}