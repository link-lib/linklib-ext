import { createClient } from '../../../utils/supabase/client';

export function useWithAuth(
	handler: () => void,
	triggerLoginAction: () => void | undefined
) {
	const supabase = createClient();
	return async function () {
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			triggerLoginAction();
		} else {
			handler();
		}
	};
}
