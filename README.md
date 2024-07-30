# To add
```js
export const calculateProgress = (words: WordPair[]) => {
    if (words.length === 0) return 0;

    const filledCount = words.filter(word => word.value !== "").length;
    const percentage = Math.round((filledCount / words.length) * 100);
    return percentage;
}
```

https://www.npmjs.com/package/levenshtein-edit-distance
