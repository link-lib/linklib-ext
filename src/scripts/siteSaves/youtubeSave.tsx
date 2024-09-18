import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import React, { useContext, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import '../../index.css';
import { saveSocialSiteItem } from '@/backend/saveSocialSiteItem';
import {
	AuthContext,
	AuthContextType,
	AuthProvider,
} from '../auth/context/AuthModalContext';
import { AuthModal } from '@/scripts/auth/components/AuthModal';
import { withAuth } from '@/backend/auth/withAuth';

// Function to be called when "save" is clicked
function saveItem(itemId: string, toast: any): void {
	console.log('Save item with ID:', itemId);
	saveSocialSiteItem({ type: 'YOUTUBE', link: itemId })
		.then(() =>
			toast({
				title: 'Item saved',
				description: `Item ID: ${itemId}`,
				duration: 1500,
			})
		)
		.catch(() =>
			toast({
				title: 'Error saving item.',
				duration: 1500,
			})
		);
}

// Function to create the SVG icon
function createSvgIcon(): SVGSVGElement {
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	svg.setAttribute('width', '24');
	svg.setAttribute('height', '24');
	svg.setAttribute('viewBox', '0 0 24 24');
	svg.setAttribute('fill', 'none');
	svg.setAttribute('stroke', 'currentColor');
	svg.setAttribute('stroke-width', '2');
	svg.setAttribute('stroke-linecap', 'round');
	svg.setAttribute('stroke-linejoin', 'round');
	svg.classList.add('lucide', 'lucide-hard-drive-upload');

	const path1 = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	path1.setAttribute('d', 'm16 6-4-4-4 4');

	const path2 = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	path2.setAttribute('d', 'M12 2v8');

	const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
	rect.setAttribute('width', '20');
	rect.setAttribute('height', '8');
	rect.setAttribute('x', '2');
	rect.setAttribute('y', '14');
	rect.setAttribute('rx', '2');

	const path3 = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	path3.setAttribute('d', 'M6 18h.01');

	const path4 = document.createElementNS(
		'http://www.w3.org/2000/svg',
		'path'
	);
	path4.setAttribute('d', 'M10 18h.01');

	svg.appendChild(path1);
	svg.appendChild(path2);
	svg.appendChild(rect);
	svg.appendChild(path3);
	svg.appendChild(path4);

	return svg;
}

// Function to inject "save to Linklib" button into YouTube menu
function injectSaveButton(
	toast: any,
	authModalContext: AuthContextType | undefined
): void {
	// Get the menu element
	const menu = document.querySelector<HTMLDivElement>(
		'#above-the-fold #top-level-buttons-computed'
	);

	// Check if the "save to Linklib" button already exists
	if (!menu || menu.querySelector('.linklib-save')) {
		return;
	}

	// Create the "save to Linklib" button structure
	const buttonViewModel = document.createElement('yt-button-view-model');
	buttonViewModel.className = 'style-scope ytd-menu-renderer';

	const buttonView = document.createElement('button-view-model');
	buttonView.className = 'yt-spec-button-view-model';

	const button = document.createElement('button');
	button.className =
		'yt-spec-button-shape-next yt-spec-button-shape-next--tonal yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-leading linklib-save';
	button.setAttribute('aria-label', 'Save to Linklib');
	button.setAttribute('title', 'Save to Linklib');

	// Create icon container
	const iconContainer = document.createElement('div');
	iconContainer.className = 'yt-spec-button-shape-next__icon';
	iconContainer.setAttribute('aria-hidden', 'true');

	const ytIcon = document.createElement('yt-icon');
	ytIcon.id = 'linklib';
	ytIcon.style.width = '24px';
	ytIcon.style.height = '24px';

	const ytIconShape = document.createElement('yt-icon-shape');
	ytIconShape.className = 'style-scope yt-icon';

	const iconShape = document.createElement('icon-shape');
	iconShape.className = 'yt-spec-icon-shape';

	const svg = createSvgIcon();
	iconShape.appendChild(svg);
	ytIconShape.appendChild(iconShape);
	ytIcon.appendChild(ytIconShape);
	iconContainer.appendChild(ytIcon);

	const buttonTextContent = document.createElement('div');
	buttonTextContent.className =
		'yt-spec-button-shape-next__button-text-content';
	buttonTextContent.textContent = 'Save to Linklib';

	const touchFeedbackShape = document.createElement(
		'yt-touch-feedback-shape'
	);
	touchFeedbackShape.style.borderRadius = 'inherit';

	const touchFeedbackShapeInner = document.createElement('div');
	touchFeedbackShapeInner.className =
		'yt-spec-touch-feedback-shape yt-spec-touch-feedback-shape--touch-response';
	touchFeedbackShapeInner.setAttribute('aria-hidden', 'true');

	const touchFeedbackShapeStroke = document.createElement('div');
	touchFeedbackShapeStroke.className = 'yt-spec-touch-feedback-shape__stroke';

	const touchFeedbackShapeFill = document.createElement('div');
	touchFeedbackShapeFill.className = 'yt-spec-touch-feedback-shape__fill';

	touchFeedbackShapeInner.appendChild(touchFeedbackShapeStroke);
	touchFeedbackShapeInner.appendChild(touchFeedbackShapeFill);
	touchFeedbackShape.appendChild(touchFeedbackShapeInner);

	button.appendChild(iconContainer);
	button.appendChild(buttonTextContent);
	button.appendChild(touchFeedbackShape);

	// Add click event to call saveItem function with the item ID
	button.addEventListener('click', (e) => {
		e.preventDefault();
		const videoId = new URLSearchParams(window.location.search).get('v');

		if (videoId) {
			const saveYoutubeHandler = withAuth(
				() => saveItem(videoId, toast),
				authModalContext
			);

			saveYoutubeHandler();
		}
	});

	buttonView.appendChild(button);
	buttonViewModel.appendChild(buttonView);
	menu.appendChild(buttonViewModel);
}

// Function to observe changes in the DOM and inject the button when the menu is available
function observeMenu(
	toast: any,
	authModalContext: AuthContextType | undefined
): void {
	const observer = new MutationObserver(() => {
		const fold = document.querySelector<HTMLDivElement>('#above-the-fold');
		if (!fold) return;

		const menu = fold.querySelector<HTMLDivElement>(
			'#top-level-buttons-computed'
		);

		if (menu) {
			injectSaveButton(toast, authModalContext);
			observer.disconnect();
		}
	});

	observer.observe(document.body, { childList: true, subtree: true });
}

// React component to handle toast notifications
export const YouTubeToast = () => {
	const { toast } = useToast();
	const authModalContext = useContext(AuthContext);

	useEffect(() => {
		observeMenu(toast, authModalContext);
	}, [toast, authModalContext]);

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
		<AuthProvider>
			<Toaster />
			<YouTubeToast />
			<AuthModal />
		</AuthProvider>
	</React.StrictMode>
);
