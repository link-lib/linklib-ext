import { createClient, setLocalStorage } from '@/utils/supabase/client';
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

	async function refreshSession(refreshToken: string) {
		const { data, error } = await supabase.auth.refreshSession({
			refresh_token: refreshToken,
		});
		if (error) {
			console.error('Error refreshing session:', error);
			return null;
		}
		return data.session;
	}

	return async function (this: any, ...args: Parameters<T>) {
		let currentSession = await getValidSession();

		if (!currentSession) {
			// Try to refresh the session
			const storedSession = await supabase.auth.getSession();
			if (storedSession.data.session?.refresh_token) {
				currentSession = await refreshSession(
					storedSession.data.session.refresh_token
				);
				if (currentSession) {
					await setLocalStorage({ session: currentSession });
					return handler.apply(this, args);
				}
			}
		}

		if (currentSession) {
			// We have a valid session, make sure it is set to supabase auth
			const userSession = await supabase.auth.setSession({
				refresh_token: currentSession.refresh_token,
				access_token: currentSession.access_token,
			});

			if (userSession.data.session) {
				// Successfully got the session, complete the handler
				return handler.apply(this, args);
			} else {
				// Session setting failed, open the login modal
				authModalContext.setIsOpen(true);
			}
		} else {
			// No valid session, show login modal
			authModalContext.setIsOpen(true);
		}
	};
}
