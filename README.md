+page.svelte
```js
<script lang="ts">
    let fileId: number = 1; // Example fileId, you can change this as needed

    async function downloadXML() {
        const form = new FormData();
        form.append('fileId', fileId.toString());

        try {
            const response = await fetch('/', {
                method: 'POST',
                body: form,
            });

            if (!response.ok) {
                throw new Error('Failed to download XML');
            }

            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'strings.xml';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error:', error);
        }
    }
</script>

<label>
    Enter File ID:
    <input type="number" bind:value={fileId} min="1" />
</label>
<button on:click={downloadXML}>Download XML</button>

```

+server.ts
```js
export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const fileId = formData.get('fileId');

    if (!fileId || typeof fileId !== 'string') {
        return new Response('Invalid fileId', { status: 400 });
    }

    const fileIdNumber = parseInt(fileId, 10);
    if (isNaN(fileIdNumber)) {
        return new Response('Invalid fileId number', { status: 400 });
    }

    const wordsArray: Word[] = [
        { id: 1, name: "Save", value: "Shrani", fileId: 1, reviewRequired: false, reviewed: true, forbidden: false, translation: "Shrani" },
        { id: 2, name: "Edit", value: "Uredi", fileId: 1, reviewRequired: false, reviewed: true, forbidden: false, translation: "" },
        { id: 3, name: "Do you want to continue?", value: "Ali želite nadaljevati?", fileId: 1, reviewRequired: false, reviewed: true, forbidden: false, translation: "" },
        { id: 4, name: "Exit", value: "Izhod", fileId: 1, reviewRequired: false, reviewed: true, forbidden: false, translation: "" },
        { id: 5, name: "You can't cancel this. Would you like to continue?", value: "", fileId: 1, reviewRequired: false, reviewed: true, forbidden: false, translation: "" },
        { id: 6, name: "Arrow-left", value: "Puščica-levo", fileId: 1, reviewRequired: false, reviewed: true, forbidden: false, translation: "" },
        { id: 7, name: "Options", value: "", fileId: 1, reviewRequired: false, reviewed: true, forbidden: false, translation: "" }
    ];

    const words = wordsArray.filter(word => word.fileId === fileIdNumber);
    const xmlString = generateXMLString(words);

    return new Response(xmlString, {
        headers: {
            'Content-Type': 'application/xml',
            'Content-Disposition': 'attachment; filename=strings.xml'
        }
    });
};

function generateXMLString(words: Word[]): string {
    // Start with the opening <resources> tag
    let xmlString = '<resources>\n';

    // Loop through each word in the array
    words.forEach(word => {
        // Append each <string> element with name and translation as the value
        xmlString += `<string name="${word.name}">${word.value}</string>\n`;
    });

    // Close the </resources> tag
    xmlString += '</resources>';

    return xmlString;
}
```
