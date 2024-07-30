export interface UserDataUpdate {
    name: string;
    phone?: string;
    street?: string;
    postnumber?: string;
    city?: string;
    school?: string;
    birthday?: string; 
    firstLanguage?: string;
}

export interface FileCreateData {
    name: string;
    sourceLanguage: string;
    targetLanguage: string;
    createdBy: string;
    progress?: number;
}

export interface WordPair {
    name: string;
    value: string;
}

export interface UserFileIds {
    userId: string;
    fileId: number;
}