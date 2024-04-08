import React from 'react';
import ReactDOM from 'react-dom/client';
import HighlighterApp from '@/scripts/highlighter/HighlighterApp';

const root = document.createElement('div');
root.id = 'crx-root';
const shadow = root.attachShadow({ mode: 'open' });

document.body.appendChild(root);

ReactDOM.createRoot(shadow).render(
	<React.StrictMode>
		<HighlighterApp />
	</React.StrictMode>
);
