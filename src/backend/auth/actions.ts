import { Session } from '@supabase/supabase-js';
import {
	createClient,
	getLocalStorage,
	removeLocalStorage,
	setLocalStorage,
} from '../../../utils/supabase/client';
import { LoginFormSchema, SignupFormSchema } from './definitions';

export async function logIn(formData: FormData) {
	const currentSession = (await getLocalStorage('session')) as Session;
	if (
		currentSession &&
		currentSession.expires_at &&
		currentSession.expires_in >= 0
	) {
		return;
	}
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		throw new Error('Error in logging in');
	}

	const supabase = createClient();
	const { data, error } = await supabase.auth.signInWithPassword(
		validatedFields.data
	);

	if (error) {
		throw new Error('Error in logging in');
	}

	await setLocalStorage({ session: data.session });
}

export const signUp = async (formData: FormData) => {
	const currentSession = (await getLocalStorage('session')) as Session;
	if (
		currentSession &&
		currentSession.expires_at &&
		currentSession.expires_at >= 0
	) {
		return;
	}
	const validatedFields = SignupFormSchema.safeParse({
		firstName: formData.get('firstName'),
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const supabase = createClient();
	const { firstName, email, password } = validatedFields.data;
	const { error } = await supabase.auth.signUp({
		email,
		password,
		options: {
			data: {
				firstName,
			},
		},
	});

	if (error) {
		throw new Error('Error in signing up.');
	}

	await logIn(formData);
};

export const signOut = async () => {
	const supabase = createClient();
	await removeLocalStorage('session');
	await supabase.auth.signOut();
};
