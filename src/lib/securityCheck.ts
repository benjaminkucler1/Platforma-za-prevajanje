import { levenshteinEditDistance } from 'levenshtein-edit-distance';
import { type WordType } from './db/typeUtils';

export const updateForbiddenWords = (words: WordType[], forbiddenWords: string[]) => {
	return words.map((word) => {
		if (!word.value) {
			return word;
		}
		const isForbidden = forbiddenWords.some((forbiddenWord) => word.value!.includes(forbiddenWord));
		if (isForbidden) {
			return { ...word, forbidden: true };
		}
		return word;
	});
};

export const updateReviewRequired = (words: WordType[], maxDistance: number): WordType[] => {
	return words.map((word) => {
		if (!word.value || !word.translation) {
			return word;
		}

		const distance = levenshteinEditDistance(word.value, word.translation);
        console.log(word.value + " -> " + word.translation + " = " + distance);
		if (distance > maxDistance) {
			word.reviewRequired = true;
		}
		return word;
	});
};

export function checkWords(words: WordType[], forbiddenWords: string[], maxDistance: number): WordType[] {
	let updatedWords = updateForbiddenWords(words, forbiddenWords);

	// Filter out forbidden words before updating review required
	const nonForbiddenWords = updatedWords.filter((word) => !word.forbidden);
	const reviewedWords = updateReviewRequired(nonForbiddenWords, maxDistance);

	// Merge the updated non-forbidden words back into the original list
	reviewedWords.forEach((updatedWord) => {
		const index = updatedWords.findIndex((word) => word.id === updatedWord.id);
		if (index !== -1) {
			updatedWords[index] = updatedWord;
		}
	});

	return updatedWords;
}
