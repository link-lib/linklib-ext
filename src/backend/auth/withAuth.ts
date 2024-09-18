import { getValidSession } from './authUtils';
import { AuthContextType } from '../../scripts/auth/context/AuthModalContext';
import { createClient, setLocalStorage } from '@/utils/supabase/client';

export function withAuth<T extends (...args: any[]) => any>(
	handler: T,
	authModalContext: AuthContextType | undefined
) {
	const supabase = createClient();
	if (!authModalContext) {
		throw new Error(
			'AuthModalContext is not provided. Are you sure this component is wrapped in an AuthProvider?'
		);
	}

	return async function (this: any, ...args: Parameters<T>) {
		let currentSession = await getValidSession();

		if (!currentSession) {
			currentSession = authModalContext.session;
			await setLocalStorage({ session: JSON.stringify(currentSession) });
		}

		if (currentSession) {
			await supabase.auth.setSession({
				access_token: currentSession.access_token,
				refresh_token: currentSession.refresh_token,
			});
			return handler.apply(this, args);
		} else {
			// No valid session, show login modal
			authModalContext.setIsOpen(true);
		}
	};
}
