import {
	createClient,
	getLocalStorage,
	setLocalStorage,
} from '../../../utils/supabase/client';
import { Session } from '@supabase/supabase-js';
import { AuthModalContextType } from './context/AuthModalContext';

export function useWithAuth(
	handler: () => void,
	authModalContext: AuthModalContextType | undefined
) {
	const supabase = createClient();

	if (!authModalContext) {
		throw new Error(
			'AuthModalContext is not provided. Are you sure this component is wrapped in an AuthModalProvider?'
		);
	}

	async function getNewSession() {
		const { data: session } = await supabase.auth.getSession();
		return session.session;
	}

	return async function () {
		// Retrieve the current session stored in local storage.
		const currentSession = (await getLocalStorage('session')) as Session;
		// Check if the session exists, the user exists, and the session hasn't expired
		if (
			!currentSession ||
			!currentSession.expires_at ||
			!currentSession?.user ||
			currentSession.expires_in <= 0
		) {
			// Check if we have another active Supabase session
			const newSession = await getNewSession();
			if (newSession) {
				// If we do, set it to local storage and kickoff the event
				await setLocalStorage({ session: newSession });
				handler();
			} else {
				// If we don't, show log in modal
				// TODO: once the user finishes logging in/signing up, we lose the handler promise that was sent in
				authModalContext.setIsOpen(true);
			}
		} else {
			// We have a valid session saved, make sure it is set to supabase auth
			const userSession = await supabase.auth.setSession({
				refresh_token: currentSession.refresh_token,
				access_token: currentSession.access_token,
			});

			if (userSession) {
				// if we were able to set it, complete the promise passed in
				handler();
			} else {
				// If not, open the login modal and try again
				authModalContext.setIsOpen(true);
			}
		}
	};
}
