import { useEffect, useState } from 'react';

import ActionBar from '@/scripts/highlighter/components/ActionBar/ActionBar';
import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import { createRoot } from 'react-dom/client';
import { Highlight } from '@/scripts/highlighter/components/Highlight';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { extractHighlightData } from '@/scripts/highlighter/utils/highlightUtils';
// import ReactDOM from 'react-dom';

const Highlights: HighlightData[] = [];

const HighlighterApp = () => {
	const [highlights, setHighlights] = useState<HighlightData[]>([]);
	const [markerPosition, setMarkerPosition] = useState<
		MarkerPosition | { display: 'none' }
	>({ display: 'none' });

	useEffect(() => {
		document.addEventListener('click', () => {
			if (getSelectedText().length > 0) {
				setMarkerPosition(getMarkerPosition());
			}
		});

		document.addEventListener('selectionchange', () => {
			if (getSelectedText().length === 0) {
				setMarkerPosition({ display: 'none' });
			}
		});

		return () => {
			document.removeEventListener('click', () => {
				if (getSelectedText().length > 0) {
					setMarkerPosition(getMarkerPosition());
				}
			});

			document.removeEventListener('selectionchange', () => {
				if (getSelectedText().length === 0) {
					setMarkerPosition({ display: 'none' });
				}
			});
		};
	}, []);

	const handleHighlight = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData();
			debugger;
			if (highlightData) {
				setHighlights([...highlights, highlightData]);
			}
			for (let i = 0; i < userSelection.rangeCount; i++) {
				const range = userSelection.getRangeAt(i);
				const highlightContainer = document.createElement('span');
				range.surroundContents(highlightContainer);
				const root = createRoot(highlightContainer);
				root.render(
					<Highlight highlightElement={highlightContainer}>
						{highlightContainer.innerHTML}
					</Highlight>
				);
			}
			window.getSelection()?.empty();
		}
	};

	const handleAddNote = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			for (let i = 0; i < userSelection.rangeCount; i++) {
				const range = userSelection.getRangeAt(i);
				const highlightContainer = document.createElement('span');
				range.surroundContents(highlightContainer);
				const root = createRoot(highlightContainer);
				root.render(
					<Highlight
						highlightElement={highlightContainer}
						notesOpen={true}
					>
						{highlightContainer.innerHTML}
					</Highlight>
				);
			}
			window.getSelection()?.empty();
		}
	};

	const handleClose = () => {
		// setMarkerPosition({ display: 'none' });
		window.getSelection()?.empty();
	};

	const handleRate = (rating: number) => {
		const userSelection = window.getSelection();
		if (userSelection) {
			for (let i = 0; i < userSelection.rangeCount; i++) {
				const range = userSelection.getRangeAt(i);
				const highlightContainer = document.createElement('span');
				range.surroundContents(highlightContainer);
				const root = createRoot(highlightContainer);
				root.render(
					<Highlight
						highlightElement={highlightContainer}
						initialRating={rating}
					>
						{highlightContainer.innerHTML}
					</Highlight>
				);
			}
			window.getSelection()?.empty();
		}
	};

	return (
		<>
			<ActionBar
				markerPosition={markerPosition}
				handleHighlight={handleHighlight}
				handleAddNote={handleAddNote}
				handleClose={handleClose}
				handleRate={handleRate}
			/>
			<div className='md:sticky lg:block'></div>
		</>
	);
};

export default HighlighterApp;
