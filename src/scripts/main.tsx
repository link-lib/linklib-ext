import HighlighterApp from '@/scripts/highlighter/HighlighterApp';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import styles from '../../index.css?inline';
import { Toaster } from '@/components/ui/toaster';
import MenuToasts from '@/scripts/ImageDrop/MenuToasts';
import '../index.css';
import ImageDrop from '@/scripts/ImageDrop/ImageDrop';
import { AuthModalProvider } from '@/backend/auth/context/AuthModalContext';
import { AuthModal } from '@/backend/auth/components/AuthModal';

const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext';
root.style.fontSize = '16px';
// const shadow = root.attachShadow({ mode: 'open' });

document.body.appendChild(root);

// const renderIn = document.createElement('div');
// shadow.appendChild(renderIn);

const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(
	<React.StrictMode>
		<div className='linklib-ext .linklib-ext'>
			<html>
				<AuthModalProvider>
					<HighlighterApp />
					<ImageDrop />
					<Toaster />
					<MenuToasts />
					<AuthModal />
				</AuthModalProvider>
				<div className='md:sticky md:block'></div>
			</html>
		</div>
	</React.StrictMode>
);

export { reactRoot };
