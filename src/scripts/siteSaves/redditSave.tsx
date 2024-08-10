import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import { saveSocialSiteItem } from '@/backend/saveSocialSiteItem';

// Function to be called when "save" is clicked
function saveItem(itemId: string, toast: any): void {
	saveSocialSiteItem({ type: 'REDDIT', nativeid: itemId })
		.then(() =>
			toast({
				title: 'Item saved',
				description: `Item ID: ${itemId}`,
				duration: 2000,
			})
		)
		.catch(() =>
			toast({
				title: 'Failed to save item',
				description: `Item ID: ${itemId}`,
				duration: 2000,
			})
		);
}

// Function to inject "save to Linklib" button into Reddit posts
function injectSaveButton(toast: any): void {
	// Get all post elements
	const postElements =
		document.querySelectorAll<HTMLDivElement>('.flat-list.buttons');

	postElements.forEach((post) => {
		// Check if the "save to Linklib" button already exists
		if (post.querySelector('.linklib-save')) {
			return;
		}

		// Find the element containing the post ID
		const postIdElement = post.querySelector<HTMLAnchorElement>('a');
		const postHref = postIdElement ? postIdElement.href : null;
		if (!postHref) return;

		// Create the "save to Linklib" button
		const saveButton = document.createElement('a');
		saveButton.href = '#';
		saveButton.textContent = 'save to Linklib';
		saveButton.className = 'linklib-save';

		const listItem = document.createElement('li');
		listItem.appendChild(saveButton);

		// Add click event to call saveItem function with the item ID
		saveButton.addEventListener('click', (e) => {
			e.preventDefault();
			saveItem(postHref, toast);
		});

		// Append the "save to Linklib" button to the post element
		post.appendChild(listItem);
	});
}

// React component to handle toast notifications
const RedditToast = () => {
	const { toast } = useToast();

	useEffect(() => {
		injectSaveButton(toast);
	}, []);

	return <div></div>;
};

// Create a root element for the React component
const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext';
document.body.appendChild(root);

// Render the React component
ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<Toaster />
		<RedditToast />
	</React.StrictMode>
);
