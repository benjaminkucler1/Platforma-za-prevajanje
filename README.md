# To add
```js
export const calculateProgress = (words: WordPair[]) => {
    if (words.length === 0) return 0;

    const filledCount = words.filter(word => word.value !== "").length;
    const percentage = Math.round((filledCount / words.length) * 100);
    return percentage;
}
```
```js
export const updateForbiddenWords = (words: Word[], forbiddenWords: string[]) =>{
    return words.map(word => {
        const isForbidden = forbiddenWords.some(forbiddenWord => word.value.includes(forbiddenWord));
        if (isForbidden) {
            return { ...word, forbidden: true };
        }
        return word;
    });
}
```
```js
import { levenshteinEditDistance } from 'levenshtein-edit-distance';

export const updateReviewRequired = (words: Word[], maxDistance: number): Word[] => {
    return words.map(word => {
        const distance = levenshteinEditDistance(word.value, word.translation);
        if (distance > maxDistance) {
            word.reviewRequired = true;     
        }
        return word;
    });
}
```

```js
function checkWords(words: Word[], forbiddenWords: string[], maxDistance: number): Word[] {
    let updatedWords = updateForbiddenWords(words, forbiddenWords);
    
    // Filter out forbidden words before updating review required
    const nonForbiddenWords = updatedWords.filter(word => !word.forbidden);
    const reviewedWords = updateReviewRequired(nonForbiddenWords, maxDistance);
    
    // Merge the updated non-forbidden words back into the original list
    reviewedWords.forEach(updatedWord => {
        const index = updatedWords.findIndex(word => word.id === updatedWord.id);
        if (index !== -1) {
            updatedWords[index] = updatedWord;
        }
    });

    return updatedWords;
}
```
https://www.npmjs.com/package/levenshtein-edit-distance

https://www.deepl.com/en/your-account/subscription
https://developers.deepl.com/docs
