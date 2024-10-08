import { AuthContextType } from '../../scripts/auth/context/AuthModalContext';

export function withAuth<T extends (...args: any[]) => any>(
	handler: T,
	authModalContext: AuthContextType | undefined
) {
	if (!authModalContext) {
		throw new Error(
			'AuthModalContext is not provided. Are you sure this component is wrapped in an AuthProvider?'
		);
	}

	return async function (this: any, ...args: Parameters<T>) {
		const currentSession = authModalContext.session;

		if (currentSession) {
			// I shouldn't have to do this
			// I stored the session locally, so should access through context but for some reason its not registered in supabase
			// why????
			// await supabase.auth.setSession({
			// 	access_token: currentSession.access_token,
			// 	refresh_token: currentSession.refresh_token,
			// });
			return handler.apply(this, args);
		} else {
			// No valid session, show login modal
			authModalContext.setIsOpen(true);
		}
	};
}
