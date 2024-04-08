import React from 'react';
import ReactDOM from 'react-dom/client';
import HighlighterApp from '@/scripts/highlighter/HighlighterApp';
import '../../index.css';

const root = document.createElement('div');
root.id = 'crx-root';
// const shadow = root.attachShadow({ mode: 'open' });

document.body.appendChild(root);

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		<HighlighterApp />
	</React.StrictMode>
);
