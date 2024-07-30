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
https://www.npmjs.com/package/levenshtein-edit-distance

https://www.deepl.com/en/your-account/subscription
https://developers.deepl.com/docs
