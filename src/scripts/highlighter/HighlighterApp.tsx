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
						if (node.nodeType === Node.TEXT_NODE) {
							if (
								node.nodeValue &&
								node.nodeValue.trim() !== ''
							) {
								return NodeFilter.FILTER_ACCEPT;
							}
						}
						return NodeFilter.FILTER_REJECT;
					},
				}
			);
			
			walker.currentNode = startNode; // Start the walker at the startNode
			let currentNode: Node | null = walker.currentNode;
			let inHighlight = true;
			let characterLength =
				highlightData.matching.textPosition.end -
				highlightData.matching.textPosition.start;

			if (currentNode.nodeType !== Node.TEXT_NODE) {
				currentNode = walker.nextNode();
			}

			let startOffset = highlightData.matching.rangeSelector.startOffset;

			debugger;
			while (currentNode && inHighlight) {
				// If we're at the end node, stop highlighting after this loop.
				if (currentNode.parentElement === endNode) {
					inHighlight = false;
				}

				const range = new Range();

				range.setStart(currentNode, startOffset);

				let endOffset = currentNode.length;

				debugger;
				// If in final container
				if (!inHighlight) {
					// If final container is smaller than character length, it may be because there's multiple text elements
					if (currentNode.length < characterLength + startOffset) {
						inHighlight = true;
						endOffset = currentNode.length;
						characterLength -=
							endOffset -
							highlightData.matching.rangeSelector.startOffset;
						// if final container is smaller than character length,
					} else {
						endOffset = startOffset + characterLength;
					}
				} else {
					characterLength -= endOffset - startOffset;
				}

				startOffset = 0;

				range.setEnd(currentNode, endOffset);

				currentNode = walker.nextNode();

				const highlightContainer = document.createElement('span');
				highlightContainer.className = 'highlight';
				highlightContainer.dataset.highlightId = `highlight-${highlightData.createdAt.getTime()}`;
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
