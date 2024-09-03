import { createClient, setLocalStorage } from '../../../utils/supabase/client';
import { getValidSession } from './authUtils';
import { AuthModalContextType } from '../../scripts/auth/context/AuthModalContext';

export function withAuth<T extends (...args: any[]) => any>(
	handler: T,
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

	return async function (this: any, ...args: Parameters<T>) {
		const currentSession = await getValidSession();

		if (!currentSession) {
			// Check if we have another active Supabase session
			const newSession = await getNewSession();
			if (newSession) {
				// If we do, set it to local storage and kickoff the event
				await setLocalStorage({ session: newSession });
				return handler.apply(this, args);
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

			if (userSession.data.session) {
				return handler.apply(this, args);
			} else {
				// If not, open the login modal and try again
				authModalContext.setIsOpen(true);
			}
		}
	};
}
