import React, { useContext, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from '@/components/ui/toaster';
import '../../index.css';
import { useToast } from '@/components/ui/use-toast';
import { saveSocialSiteItem } from '@/backend/saveSocialSiteItem';
import { AuthContext, AuthProvider } from '../auth/context/AuthModalContext';
import { AuthModal } from '@/scripts/auth/components/AuthModal';
import { withAuth } from '@/backend/auth/withAuth';

const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext';

document.body.appendChild(root);

export const InstagramSave = () => {
	const { toast } = useToast();

	const authModalContext = useContext(AuthContext);
	const getSaveInstagramPostHandler = useCallback(
		(postLink: string) =>
			withAuth(
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
			),
		[toast, authModalContext]
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
				}
			} else if (unsaveButton) {
				const postElement = unsaveButton.closest('article');
				const postLinkElement =
					postElement?.querySelector('a[href*="/p/"]');
				const postLink =
					(postLinkElement as HTMLAnchorElement)?.href || null;
				if (postLink) {
					// unimplemented
				}
			}
		};

		// Use event delegation on the document
		document.addEventListener('click', savePost, true);

		return () => {
			document.removeEventListener('click', savePost, true);
		};
	}, [getSaveInstagramPostHandler, toast]);

	return <div></div>;
};

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<AuthProvider>
			<Toaster />
			<InstagramSave />
			<AuthModal />
		</AuthProvider>
	</React.StrictMode>
);
