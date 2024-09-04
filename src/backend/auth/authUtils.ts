import { Session } from '@supabase/supabase-js';
import { getLocalStorage } from '@/utils/supabase/client';

export async function getValidSession(): Promise<Session | null> {
	const currentSession = (await getLocalStorage('session')) as Session;

	const isValid = !!(
		currentSession &&
		currentSession.expires_at &&
		currentSession.user &&
		currentSession.expires_in > 0
	);

	console.log('Valid session found:', isValid);
	return isValid ? currentSession : null;
}
