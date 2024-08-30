import HighlighterApp from '@/scripts/highlighter/HighlighterApp';
import React from 'react';
import ReactDOM from 'react-dom/client';
// import styles from '../../index.css?inline';
import { Toaster } from '@/components/ui/toaster';
import ImageDrop from './ImageDrop/ImageDrop';
import MenuToasts from '@/scripts/ImageDrop/MenuToasts';
import '../index.css';
import { AuthModal } from '@/scripts/auth/components/AuthModal';
import { AuthModalProvider } from './auth/context/AuthModalContext';

const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext bytebelli-internal';
root.style.fontSize = '16px';

document.body.appendChild(root);

const reactRoot = ReactDOM.createRoot(root);

reactRoot.render(
	<React.StrictMode>
		<div className='linklib-ext bytebelli-internal'>
			<html id='linklib-html'>
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
