import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from '@/components/ui/toaster';
import '../../index.css';
import { useToast } from '@/components/ui/use-toast';

const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext';
// const shadow = root.attachShadow({ mode: 'open' });

document.body.appendChild(root);

// const renderIn = document.createElement('div');
// shadow.appendChild(renderIn);

const TwitterSave = () => {
	const { toast } = useToast();

	useEffect(() => {
		const saveTweet = (event: MouseEvent) => {
			// Check if the clicked element is a "Save" button
			const target = event.target as Element;
			if (target.closest('button[data-testid="bookmark"]')) {
				const tweetElement = target.closest('article');
				const tweetLinkElement = tweetElement?.querySelector(
					'a[href*="/status/"]'
				);
				const tweetLink =
					(tweetLinkElement as HTMLAnchorElement)?.href || null;
				if (tweetLink) {
					// Send the tweet link to the background script
					chrome.runtime.sendMessage({
						action: 'saveTweet',
						link: tweetLink,
					});
					toast({
						title: 'Tweet saved',
						description: tweetLink,
						duration: 1500,
					});
				}
			} else if (target.closest('button[data-testid="removeBookmark"]')) {
				const tweetElement = target.closest('article');
				const tweetLinkElement = tweetElement?.querySelector(
					'a[href*="/status/"]'
				);
				const tweetLink =
					(tweetLinkElement as HTMLAnchorElement)?.href || null;
				if (tweetLink) {
					// Send the tweet link to the background script
					chrome.runtime.sendMessage({
						action: 'saveTweet',
						link: tweetLink,
					});
					toast({
						title: 'Tweet removed',
						description: tweetLink,
						duration: 1500,
					});
				}
			}
		};

		// Use event delegation on the document
		document.addEventListener('click', saveTweet, true);

		return () => {
			document.removeEventListener('click', saveTweet, true);
		};
	}, []);

	return <div></div>;
};

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<Toaster />
		<TwitterSave />
	</React.StrictMode>
);
