import HighlighterApp from '@/scripts/highlighter/HighlighterApp';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import styles from '../../index.css?inline';
import { Toaster } from '@/components/ui/toaster';
import ImageDrop from './ImageDrop/ImageDrop';
import MenuToasts from '@/scripts/ImageDrop/MenuToasts';
import '../index.css';
import { AuthModal } from '@/scripts/auth/components/AuthModal';
import { AuthProvider } from './auth/context/AuthModalContext';
import { SWRConfig } from 'swr';
import { PostHogProvider } from 'posthog-js/react';

const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext bytebelli-internal';
root.style.fontSize = '16px';

document.body.appendChild(root);

const reactRoot = ReactDOM.createRoot(root);

const options = {
	api_host: chrome.runtime.getManifest().env.VITE_POSTHOG_HOST,
};

reactRoot.render(
	<React.StrictMode>
		<PostHogProvider
			apiKey={chrome.runtime.getManifest().env.VITE_PUBLIC_POSTHOG_KEY}
			options={options}
		>
			<div className='linklib-ext bytebelli-internal'>
				<html id='linklib-html'>
					<AuthProvider>
						<SWRConfig>
							<HighlighterApp />
							<ImageDrop />
							<Toaster />
							<MenuToasts />
							<AuthModal />
						</SWRConfig>
					</AuthProvider>
					<div className='md:sticky md:block'></div>
				</html>
			</div>
		</PostHogProvider>
	</React.StrictMode>
);

export { reactRoot };
