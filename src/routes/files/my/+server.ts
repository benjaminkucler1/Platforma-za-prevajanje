import { getWordsByFileId } from "$lib/db/queries";
import type { WordType } from "$lib/db/typeUtils";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ request }) => {
    const formData = await request.formData();
    const fileId = Number(formData.get('fileId'));
    console.log(fileId);
    const words = await getWordsByFileId(fileId);

    const xmlString = generateXMLString(words);

    return new Response(xmlString, {
        headers: {
            'Content-Type': 'application/xml',
            'Content-Disposition': 'attachment; filename=strings.xml'
        }
    });
};

function generateXMLString(words: WordType[]): string {
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