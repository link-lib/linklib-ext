import React from 'react';
import ReactDOM from 'react-dom/client';
import HighlighterApp from '@/scripts/highlighter/HighlighterApp';
// import styles from '../../index.css?inline';
import '../../index.css';

const root = document.createElement('div');
root.id = 'crx-root';
root.className = 'linklib-ext';
// const shadow = root.attachShadow({ mode: 'open' });

document.body.appendChild(root);

// const renderIn = document.createElement('div');
// shadow.appendChild(renderIn);

ReactDOM.createRoot(root).render(
	<React.StrictMode>
		{/* <style type='text/css'>{styles}</style> */}
		{/* <style type='text/css'>{styles2}</style> */}
		<HighlighterApp />
	</React.StrictMode>
);
