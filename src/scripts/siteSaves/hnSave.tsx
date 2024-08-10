import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import { saveSocialSiteItem } from '@/backend/saveSocialSiteItem';

// Function to be called when "save" is clicked
function saveItem(itemId: string, toast: any): void {
	console.log('Save item with ID:', itemId);
	saveSocialSiteItem({ type: 'HN', nativeid: itemId })
		.then(() =>
			toast({
				title: 'Item saved',
				description: `Item ID: ${itemId}`,
				duration: 1500,
			})
		)
		.catch(() =>
			toast({
				title: 'Error saving item',
				description: `Item ID: ${itemId}`,
				duration: 1500,
			})
		);
}

// Function to inject "save" link into subtext menu
function injectSaveLink(toast: any): void {
	// Get all subline elements
	const sublineElements =
		document.querySelectorAll<HTMLSpanElement>('.subline');

	sublineElements.forEach((subline) => {
		if (subline.querySelector('.linklib-save')) {
			return;
		}

		// Find the last <a> element within the subline
		const lastLink = subline.querySelectorAll<HTMLAnchorElement>('a');
		if (lastLink.length === 0) return;
		const lastAnchor = lastLink[lastLink.length - 1];

		// Extract the item ID from the href attribute of the last <a> element
		const href = lastAnchor.href;
		const urlParams = new URLSearchParams(new URL(href).search);
		const itemId = urlParams.get('id');
		if (!itemId) return;

		// Create the separator
		const separator = document.createElement('span');
		separator.textContent = ' | ';

		// Create the "save" link
		const saveLink = document.createElement('a');
		saveLink.href = '#';
		saveLink.textContent = 'save';
		saveLink.className = 'linklib-save';

		// Add click event to call saveItem function with the item ID
		saveLink.addEventListener('click', (e) => {
			e.preventDefault();
			saveItem(itemId, toast);
		});

		// Append the separator and the "save" link to the subline element
		subline.appendChild(separator);
		subline.appendChild(saveLink);
	});
}

// React component to handle toast notifications
const HNToast = () => {
	const { toast } = useToast();

	useEffect(() => {
		injectSaveLink(toast);
	}, [toast]);

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
		<HNToast />
	</React.StrictMode>
);
