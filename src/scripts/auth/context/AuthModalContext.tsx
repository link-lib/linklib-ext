import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { createClient } from '@/utils/supabase/client';
import posthog from 'posthog-js';

export interface AuthContextType {
	session: Session | null;
	user: User | null;
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
	accessToken: string | null;
	setSession: (session: Session | null) => void;
	setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [session, setSession] = useState<Session | null>(null);
	const [user, setUser] = useState<User | null>(null);
	const [accessToken, setAccessToken] = useState<string | null>(null);
	const [isOpen, setIsOpen] = useState(false);

	const supabase = createClient();

	useEffect(() => {
		// Get initial session
		supabase.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
			setUser(session?.user ?? null);

			// Identify user in PostHog if session exists
			if (session?.user) {
				posthog.identify(session.user.id, {
					email: session.user.email,
					name: session.user.user_metadata.name,
					firstName: session.user.user_metadata.firstName,
					avatar: session.user.user_metadata.picture,
					platform: 'extension',
				});
			}
		});

		// Listen for auth changes
		const {
			data: { subscription },
		} = supabase.auth.onAuthStateChange((event, session) => {
			console.log(`Supabase auth event: ${event}`);
			setSession(session);
			setUser(session?.user ?? null);

			// Handle different auth events
			switch (event) {
				case 'INITIAL_SESSION':
				case 'SIGNED_IN':
					if (!session) {
						break;
					}
					// Handle sign in (e.g., store user info in localStorage)
					setUser(session.user);
					setSession(session);

					break;
				case 'SIGNED_OUT':
					// Handle sign out (e.g., clear user info from localStorage)
					setUser(null);
					setSession(null);
					setAccessToken(null);
					break;
				case 'TOKEN_REFRESHED':
					// There is a background process that keeps track of when the session should be refreshed so we will always receive valid tokens by listening to this event.
					// The frequency of this event is related to the JWT expiry limit configured on the project, currently 1 hour.
					setAccessToken(session.access_token);
					setSession(session);
					setUser(session.user);

					break;
			}
		});

		// Cleanup subscription on unmount
		return () => {
			subscription.unsubscribe();
		};
	}, [supabase.auth]);

	return (
		<AuthContext.Provider
			value={{
				session,
				user,
				isOpen,
				setIsOpen,
				accessToken,
				setSession,
				setUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
