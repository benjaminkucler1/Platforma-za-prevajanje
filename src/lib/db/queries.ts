import { and, asc, desc, eq } from 'drizzle-orm';
import { db } from './db.server';
import { fileTable, userFileTable, userTable, wordTable } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { fail } from '@sveltejs/kit';
import type { FileCreateData, UserDataUpdate, UserFileIds, WordValues } from '$lib/types/interfaces';
import { FileStatusEnum, LanguageSourceEnum, LanguageTargetEnum } from '$lib/types/enums';
import type { WordType } from './typeUtils';

//user
export async function emailExists(email: string) {
	const user = await db.query.userTable.findFirst({
		where: eq(userTable.email, email)
	});

	return user;
}

export async function getUserEmptySettings(email: string) {
	const result = await db
		.select({
			emptySettings: userTable.emptySettings
		})
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	return result[0];
}

export async function getUserIdByEmail(email: string) {
	const result = await db
		.select({
			id: userTable.id
		})
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	return result[0].id;
}

export async function getUserTypeByEmail(email: string) {
	const result = await db
		.select({
			type: userTable.role
		})
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	return result[0];
}

export async function updateUserData(email: string, data: UserDataUpdate) {
	try {
		await db
			.update(userTable)
			.set({
				name: data.name,
				phone: data.phone,
				street: data.street,
				postnumber: +data.postnumber!,
				city: data.city,
				school: data.school,
				birthday: data.birthday,
				firstLanguage: data.firstLanguage as LanguageTargetEnum,
				emptySettings: false
			})
			.where(eq(userTable.email, email));
	} catch (err) {
		console.log('updateUserData: error');
		return fail(500);
	}
}

export async function getUserDataByEmail(email: string) {
	const result = await db
		.select({
			name: userTable.name,
			phone: userTable.phone,
			street: userTable.street,
			postNumber: userTable.postnumber, // Ensure the casing matches the interface
			city: userTable.city,
			school: userTable.school,
			birthday: userTable.birthday,
			firstLanguage: userTable.firstLanguage
		})
		.from(userTable)
		.where(eq(userTable.email, email))
		.limit(1);

	// Assuming the query will always return a result, otherwise handle null/undefined appropriately
	return {
		name: result[0]?.name ?? '',
		phone: result[0]?.phone ?? undefined,
		street: result[0]?.street ?? undefined,
		postnumber: result[0]?.postNumber?.toString() ?? undefined,
		city: result[0]?.city ?? undefined,
		school: result[0]?.school ?? undefined,
		birthday: result[0]?.birthday ?? undefined,
		firstLanguage: result[0]?.firstLanguage ?? undefined
	};
}

//FILES

export async function insertFile(data: FileCreateData) {
		const id = await db.insert(fileTable).values({
			name: data.name,
			sourceLanguage: data.sourceLanguage as LanguageSourceEnum,
			targetLanguage: data.targetLanguage as LanguageTargetEnum,
			progress: data.progress,
			createdBy: data.createdBy
		}).returning({id: fileTable.id});
	return id[0].id;
}

export async function getFilesByOwner(userId: string) {
	const userFiles = await db.query.fileTable.findMany({
		where: eq(fileTable.createdBy, userId),
		orderBy: [desc(fileTable.progress), desc(fileTable.createdOn)]
	})

	return userFiles;
}
export async function getFilesByUserNormal(userId: string) {
	const userFiles = await db.query.fileTable.findMany({
		where: eq(fileTable.currentUserId, userId),
		orderBy: [desc(fileTable.progress), desc(fileTable.createdOn)]
	})

	return userFiles;
}

export async function abandonFile(fileId: number){
	await db.update(fileTable)
		.set({ currentUserId: null, status: FileStatusEnum.OBTAINABLE })
		.where(eq(fileTable.id, fileId));
}

export async function deleteFile(fileId: number){
	await db.delete(fileTable)
		.where(eq(fileTable.id, fileId));
}

export async function getObtainableFiles(){
	const obtainableFiles = await db.query.fileTable.findMany({
		where: eq(fileTable.status, FileStatusEnum.OBTAINABLE),
		orderBy: [desc(fileTable.progress), desc(fileTable.createdOn)]
	})

	return obtainableFiles;
}
export async function obtainFile(data: UserFileIds){
	await db.update(fileTable)
		.set({ currentUserId: data.userId, status: FileStatusEnum.OBTAINED })
		.where(eq(fileTable.id, data.fileId));
}


//WORD
export async function deleteWordsByFileId(fileId: number){
	await db.delete(wordTable)
		.where(eq(wordTable.fileId, fileId));
}

export async function getWordsByFileId(fileId: number){
	const words = await db.query.wordTable.findMany({
		where: eq(wordTable.fileId, fileId),
		orderBy: [desc(wordTable.reviewRequired), desc(wordTable.forbidden)]
	});
	return words;
}

export async function insertWords(words: WordValues[], fileId: number) {
	try {
		const wordRecords = words.map(word =>({
			name: word.name,
			value: word.value,
			translation: word.translation,
			fileId: fileId
		}));

		await db.insert(wordTable).values(wordRecords);
	} catch (err){
		console.error(err);
		return fail(500);
	}
}

export async function updateWords(words: WordType[]){
	for (const word of words) {
        await db.update(wordTable)
            .set(word)
            .where(eq(wordTable.id, word.id));
    }
}

//USER_FILE
export async function insertUserFile(data: UserFileIds){
	try {
		await db.insert(userFileTable).values({
			userId: data.userId,
			fileId: data.fileId
		})
	} catch (err){
		console.error(err);
		return fail(500);
	}
}

export async function setAbandonedDate(data: UserFileIds){
	await db.update(userFileTable)
		.set({ abandonedOn: new Date() })
		.where(and(eq(userFileTable.fileId, data.fileId), 
		eq(userFileTable.userId, data.userId)));
}

export async function deleteUserFileByFileId(fileId: number){
	await db.delete(userFileTable)
		.where(eq(userFileTable.fileId, fileId));
}