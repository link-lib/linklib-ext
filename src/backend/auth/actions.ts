import { createClient } from '@/utils/supabase/client';
import { LoginFormSchema, SignupFormSchema } from './definitions';

export async function logIn(formData: FormData) {
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		throw new Error('Error in logging in');
	}

	const supabase = createClient();
	const { data, error } = await supabase.auth.signInWithPassword({
		email: validatedFields.data.email!,
		password: validatedFields.data.password,
	});

	if (error) {
		throw new Error('Error in logging in');
	}
	return data;
}

export const signUp = async (formData: FormData) => {
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
	await supabase.auth.signOut();
};

export const signInWithGoogle = async () => {
	return new Promise((resolve, reject) => {
		chrome.runtime.sendMessage(
			{ action: 'signInWithGoogle' },
			(response) => {
				if (response.success) {
					console.log('successful');
					resolve(response.session);
				} else {
					console.log('failure');
					reject(new Error(response.error));
				}
			}
		);
	});
};
