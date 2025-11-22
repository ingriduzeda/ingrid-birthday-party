import PocketBase from 'pocketbase';

// Define types for our PocketBase collections
export interface Guest {
    id: string;
    created: string;
    updated: string;
    first_name: string;
    last_name?: string;
    is_confirmed: boolean;
    companions_count: number;
    message: string;
    access_code: string;
    invite_code: string;
    link_opened_at?: string;
    link_opened_count: number;
}

export interface Config {
    id: string;
    created: string;
    updated: string;
    key: string;
    value: boolean;
}

// Define the typed PocketBase client
export interface TypedPocketBase extends PocketBase {
    collection(idOrName: 'guests'): RecordService<Guest>;
    collection(idOrName: 'config'): RecordService<Config>;
    collection(idOrName: string): RecordService<any>; // Fallback
}

import { RecordService } from 'pocketbase';

// Initialize the PocketBase client
// Use the provided URL or fallback to localhost for development if env var is missing (though we hardcode it here as requested)
const pb = new PocketBase('https://party-pocketbase.ingriduzeda.com') as TypedPocketBase;

// Disable auto-cancellation to avoid issues with React Strict Mode in dev
pb.autoCancellation(false);

export default pb;
