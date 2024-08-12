import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from '@/components/ui/toaster';
import '../../index.css';
import { useToast } from '@/components/ui/use-toast';
import { saveSocialSiteItem } from '@/backend/saveSocialSiteItem';
import { useWithAuth } from '@/backend/auth/useWithAuth';
import {
	AuthModalContext,
	AuthModalProvider,
} from '@/backend/auth/context/AuthModalContext';
import { AuthModal } from '@/backend/auth/components/AuthModal';

const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext';

document.body.appendChild(root);

const InstagramSave = () => {
	const { toast } = useToast();

	const authModalContext = useContext(AuthModalContext);
	const getSaveInstagramPostHandler = (postLink: string) =>
		useWithAuth(
			() =>
				saveSocialSiteItem({
					type: 'INSTAGRAM',
					link: postLink,
				})
					.then(() =>
						toast({
							title: 'Post saved',
							description: postLink,
						})
					)
					.catch(() =>
						toast({
							title: 'Error saving post',
							description: postLink,
						})
					),
			authModalContext
		);

	useEffect(() => {
		const savePost = (event: MouseEvent) => {
			// Check if the clicked element is a "Save" button
			const target = event.target as Element;
			const saveButton = target.closest('svg[aria-label="Save"]');
			const unsaveButton = target.closest('svg[aria-label="Remove"]');
			if (saveButton) {
				const postElement = saveButton.closest('article');
				const postLinkElement =
					postElement?.querySelector('a[href*="/p/"]');
				const postLink =
					(postLinkElement as HTMLAnchorElement)?.href || null;
				if (postLink) {
					const handler = getSaveInstagramPostHandler(postLink);
					handler();
					chrome.runtime.sendMessage({
						action: 'savePost',
						link: postLink,
					});
				}
			} else if (unsaveButton) {
				const postElement = unsaveButton.closest('article');
				const postLinkElement =
					postElement?.querySelector('a[href*="/p/"]');
				const postLink =
					(postLinkElement as HTMLAnchorElement)?.href || null;
				if (postLink) {
					// Send the post link to the background script
					chrome.runtime.sendMessage({
						action: 'removePost',
						link: postLink,
					});
					toast({
						title: 'Post removed',
						description: postLink,
						duration: 1500,
					});
				}
			}
		};

		// Use event delegation on the document
		document.addEventListener('click', savePost, true);

		return () => {
			document.removeEventListener('click', savePost, true);
		};
	}, []);

	return <div></div>;
};

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<AuthModalProvider>
			<Toaster />
			<InstagramSave />
			<AuthModal />
		</AuthModalProvider>
	</React.StrictMode>
);
