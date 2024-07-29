export interface UserDataUpdate {
    name: string;
    phone?: string;
    street?: string;
    postnumber?: string;
    city?: string;
    school?: string;
    birthday?: string; 
    firstLang?: string;
}

export interface FileCreateData {
    name: string;
    langFrom: string;
    langTo: string;
    createdBy: string;
}

export interface WordPair {
    name: string;
    value: string;
}