import { createServerClient, setLocalStorage } from '@/utils/supabase/client';

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
	if (message.action === 'signInWithGoogle') {
		signInWithGoogle().then(sendResponse);
		return true; // Indicates that the response is asynchronous
	}
});

async function signInWithGoogle() {
	const supabase = createServerClient();
	const manifest = chrome.runtime.getManifest();

	if (!manifest || !manifest.oauth2 || !manifest.oauth2.scopes) {
		console.log('no manifest');
		return { success: false, error: 'No manifest found' };
	}

	const url = new URL('https://accounts.google.com/o/oauth2/auth');
	url.searchParams.set('client_id', manifest.oauth2.client_id);
	url.searchParams.set('response_type', 'id_token');
	url.searchParams.set('access_type', 'offline');
	url.searchParams.set(
		'redirect_uri',
		`https://${chrome.runtime.id}.chromiumapp.org`
	);
	url.searchParams.set('scope', manifest.oauth2.scopes.join(' '));

	return new Promise((resolve) => {
		chrome.identity.launchWebAuthFlow(
			{
				url: url.href,
				interactive: true,
			},
			async (redirectedTo) => {
				if (chrome.runtime.lastError || !redirectedTo) {
					resolve({ success: false, error: 'Authentication failed' });
				} else {
					const url = new URL(redirectedTo);
					const params = new URLSearchParams(url.hash.slice(1));
					const idToken = params.get('id_token');

					if (!idToken) {
						resolve({ success: false, error: 'No ID token found' });
						return;
					}

					const { data, error } =
						await supabase.auth.signInWithIdToken({
							provider: 'google',
							token: idToken,
						});

					if (error) {
						resolve({
							success: false,
							error: 'Error signing in with Google',
						});
					}

					await setLocalStorage({ session: data.session });
					resolve({ success: true, session: data.session });
				}
			}
		);
	});
}
