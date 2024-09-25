import {
	SupabaseClientOptions,
	SupportedStorage,
	createClient as c,
} from '@supabase/supabase-js';
import { Database } from 'database.types';

// To fetch items from storage
export const getLocalStorage = async (key: string): Promise<any> =>
	(await chrome.storage.local.get(key))[key];

// To remove storage key from the chrome storage
export const removeLocalStorage = async (key: string): Promise<void> =>
	await chrome.storage.local.remove(key);

// For setting storage
export const setLocalStorage = async (dataObject: any): Promise<void> =>
	await chrome.storage.local.set(dataObject);

const storageAdapter: SupportedStorage = {
	getItem: async (name: string) => {
		return await getLocalStorage(name);
	},

	setItem: async (name: string, value: string) => {
		return await setLocalStorage({ [name]: value });
	},

	removeItem: async (name: string) => {
		return await removeLocalStorage(name);
	},
};

const options: SupabaseClientOptions<
	'public' extends keyof Database ? 'public' : string & keyof Database
> = {
	auth: {
		debug: true,
		persistSession: true,
		storage: storageAdapter,
		detectSessionInUrl: true,
		autoRefreshToken: true,
		flowType: 'pkce',
	},
};
const clientClient = c<Database>(
	chrome.runtime.getManifest().env.NEXT_PUBLIC_SUPABASE_URL,
	chrome.runtime.getManifest().env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
	options
);

export const createClient = () => clientClient;
