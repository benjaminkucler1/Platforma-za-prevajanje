# To add
```js
import { DOMParser } from '@xmldom/xmldom'

export const parser = (content: string) => { //contect: XMLString, featuring tag <string> with name attribute and value
    const parser = new DOMParser();
    const xml = parser.parseFromString(content, "application/xml");
    const result: { name: string, value: string }[] = [];

    const strings = xml.getElementsByTagName("string");
    for (let i = 0; i < strings.length; i++) {
        const name = strings[i].getAttribute("name");
        const value = strings[i].textContent;
        if (name && value) {
          result.push({ name, value });
        }
      }

    result.forEach(r => {
        console.log(`${r.name}: ${r.value}\n`);
    });
    
};
```
