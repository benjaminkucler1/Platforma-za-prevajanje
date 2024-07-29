import { asc, desc, eq } from 'drizzle-orm';
import { db } from './db.server';
import { fileTable, languageEnum, userTable } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { fail } from '@sveltejs/kit';
import type { FileCreateData, UserDataUpdate } from '$lib/types/interfaces';
import { LanguageEnum } from '$lib/types/enums';

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
				firstLang: data.firstLang as LanguageEnum,
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
			firstLang: userTable.firstLang
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
		firstLang: result[0]?.firstLang ?? undefined
	};
}

//FILES

export async function insertFile(data: FileCreateData) {
	try {
		await db.insert(fileTable).values({
			name: data.name,
			langFrom: data.langFrom as LanguageEnum,
			langTo: data.langTo as LanguageEnum,
			createdBy: data.createdBy
		}).returning({id: fileTable.id});
	} catch (err) {
		console.error(err);
		return fail(500);
	}
}

export async function getFilesByOwner(userId: string) {
	const userFiles = await db.query.fileTable.findMany({
		where: eq(fileTable.createdBy, userId),
		orderBy: [desc(fileTable.progress), desc(fileTable.createdOn)]
	})

	return userFiles;
}
