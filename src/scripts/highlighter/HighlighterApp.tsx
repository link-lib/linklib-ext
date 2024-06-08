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

const HighlighterApp = () => {
	const initialHighlights: HighlightData[] = [];

	const [highlights, setHighlights] =
		useState<HighlightData[]>(initialHighlights);
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
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				setHighlights([...highlights, highlightData]);
				createHighlightElement(highlightData);
			}
			window.getSelection()?.empty();
		}
	};

	const createHighlightElement = (highlightData: HighlightData) => {
		const doc = document; // Adjust if working within iframes or other contexts
		const startNode = document.evaluate(
			highlightData.matching.rangeSelector.startContainer,
			doc,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;
		const endNode = document.evaluate(
			highlightData.matching.rangeSelector.endContainer,
			doc,
			null,
			XPathResult.FIRST_ORDERED_NODE_TYPE,
			null
		).singleNodeValue;

		if (startNode && endNode) {
			// Create a TreeWalker to iterate text nodes between startNode and endNode
			const walker = document.createTreeWalker(
				doc.body,
				NodeFilter.SHOW_TEXT,
				{
					acceptNode: function (node) {
						// Only consider nodes that are logically between startNode and endNode
						if (node.nodeType === Node.TEXT_NODE) {
							if (
								node.nodeValue === '\n' ||
								node.nodeValue === ''
							)
								return NodeFilter.FILTER_REJECT;
							return NodeFilter.FILTER_ACCEPT;
						}
						return NodeFilter.FILTER_REJECT;
					},
				}
			);

			walker.currentNode = startNode; // Start the walker at the startNode
			let currentNode: Node | null = walker.currentNode;
			let inHighlight = true;

			debugger;

			if (currentNode.nodeType !== Node.TEXT_NODE) {
				currentNode = walker.nextNode();
			}

			while (currentNode && inHighlight) {
				// If we're at the end node, stop highlighting after this loop.
				if (currentNode.parentElement === endNode) {
					inHighlight = false;
				}
				const isStartNode = currentNode.parentElement === startNode;

				debugger;

				// Go to next node if we're not going to highlight it.
				if (
					currentNode.nodeType !== Node.TEXT_NODE ||
					currentNode.nodeValue === '\n'
				) {
					debugger;
					currentNode = walker.nextNode();
					continue;
				}

				const range = new Range();

				range.setStart(
					currentNode,
					isStartNode
						? highlightData.matching.rangeSelector.startOffset
						: 0
				);

				const highlightContainer = document.createElement('span');
				highlightContainer.className = 'highlight';
				highlightContainer.dataset.highlightId = `highlight-${highlightData.createdAt.getTime()}`;
				range.setEnd(
					currentNode,
					inHighlight
						? currentNode.length
						: highlightData.matching.rangeSelector.endOffset
				);

				debugger;
				currentNode = walker.nextNode();

				range.surroundContents(highlightContainer);

				const root = createRoot(highlightContainer);
				root.render(
					<Highlight highlightElement={highlightContainer}>
						{highlightContainer.innerHTML}
					</Highlight>
				);
			}
		}
	};

	const handleAddNote = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			for (let i = 0; i < userSelection.rangeCount; i++) {
				debugger;
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
			<div className='md:sticky lg:block md:tw-left-auto md:tw-bottom-5 md:tw-right-5 md:tw-pl-4'></div>
		</>
	);
};

export default HighlighterApp;
