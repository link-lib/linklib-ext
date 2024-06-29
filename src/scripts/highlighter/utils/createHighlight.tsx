import { Highlight } from '@/scripts/highlighter/components/Highlight';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { generateXPathForElement } from '@/scripts/highlighter/utils/highlightDataUtils';
import { createRoot } from 'react-dom/client';

const findTextPosition = (highlightData: HighlightData) => {
	const doc = document;
	const searchText =
		highlightData.matching.surroundingText.prefix +
		highlightData.matching.body +
		highlightData.matching.surroundingText.suffix;

	let startOffset = highlightData.matching.surroundingText.prefix.length;
	let endOffset = startOffset + highlightData.matching.body.length;

	// Use a TreeWalker to find the text node that contains the searchText
	const walker = document.createTreeWalker(
		doc.body,
		NodeFilter.SHOW_TEXT,
		null
	);

	let currentNode = walker.nextNode();
	let accumulatedText = '';
	let startNode = null;
	let endNode = null;

	// Iterate through nodes to find the complete searchText
	while (currentNode) {
		accumulatedText += currentNode.textContent;

		if (accumulatedText.includes(searchText)) {
			// Set the end node and calculate the offset
			endNode = currentNode;

			// const searchTextIndex = accumulatedText.indexOf(searchText);
			// endOffset =
			// 	searchTextIndex +
			// 	searchText.length -
			// 	(accumulatedText.length - currentNode.textContent.length);
			// const endLength =
			// 	currentNode.textContent.indexOf(highlightData.matching.body) +
			// 	highlightData.matching.body.length;

			// How many extra characters are in the currentTextNode after our desired body text

			// So problem 1: the entire body might not be in the current node
			// But we are guaranteed to be in the endNode
			const index = accumulatedText.indexOf(searchText);
			const startIndex =
				accumulatedText.length - accumulatedText.indexOf(searchText);
			const extraCharacters =
				//  Find the index where everything starts
				accumulatedText.length -
				accumulatedText.indexOf(searchText) -
				highlightData.matching.surroundingText.prefix.length -
				highlightData.matching.body.length;
			//Honestly

			// extra characters - suffix length = characters from the end
			endOffset = currentNode.textContent.length - extraCharacters;

			debugger;

			// Backtrack to find the start node
			let backtrackText = currentNode.textContent;
			let backtrackNode = currentNode;
			while (backtrackNode) {
				if (backtrackText.includes(searchText)) {
					startNode = backtrackNode;
					startOffset =
						backtrackText.indexOf(searchText) +
						highlightData.matching.surroundingText.prefix.length;
					break;
				}
				backtrackText += backtrackNode.textContent;
				backtrackNode = walker.previousNode();
			}
			break;
		}

		currentNode = walker.nextNode();
	}

	return { startNode, startOffset, endNode, endOffset };
};

const createHighlightElementTextBased = (highlightData: HighlightData) => {
	const { startNode, startOffset, endNode, endOffset } =
		findTextPosition(highlightData);

	debugger;
	if (startNode && endNode) {
		// Update the highlightData with the current start and end containers
		highlightData.matching.rangeSelector.startContainer =
			generateXPathForElement(startNode);
		highlightData.matching.rangeSelector.endContainer =
			generateXPathForElement(endNode);
		highlightData.matching.rangeSelector.startOffset = startOffset;
		highlightData.matching.rangeSelector.endOffset = endOffset;

		// Use the range-based method to create the highlight
		createHighlightElementRangeBased(highlightData);
	}
};
const createHighlightElementRangeBased = (highlightData: HighlightData) => {
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
						if (node.nodeValue && node.nodeValue.trim() !== '') {
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

		while (currentNode && inHighlight) {
			// If we're at the end node, stop highlighting after this loop.
			if (currentNode.parentElement === endNode) {
				inHighlight = false;
			}

			const range = new Range();

			range.setStart(currentNode, startOffset);

			let endOffset = currentNode.length;

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
			highlightContainer.innerHTML = range.toString(); // Set the innerHTML directly
			range.deleteContents(); // Remove the original contents of the range
			range.insertNode(highlightContainer); // Insert the new element with the correct HTML

			const root = createRoot(highlightContainer);
			root.render(
				<Highlight highlightElement={highlightContainer}>
					{highlightContainer.innerHTML}
				</Highlight>
			);
		}
	}
	debugger;
};

const strategy = 'text-based';
const createHighlight = {
	'text-based': createHighlightElementTextBased,
	'range-based': createHighlightElementRangeBased,
};

export const createHighlightElement = createHighlight[strategy];
