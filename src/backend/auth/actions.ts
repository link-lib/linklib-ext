import { createClient } from '../../../utils/supabase/client';
import { LoginFormSchema, SignupFormSchema } from './definitions';

export async function logIn(formData: FormData) {
	const validatedFields = LoginFormSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
		};
	}

	const supabase = createClient();
	const { error } = await supabase.auth.signInWithPassword(
		validatedFields.data
	);

	if (error) {
		throw new Error('Error in logging in');
	}
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
