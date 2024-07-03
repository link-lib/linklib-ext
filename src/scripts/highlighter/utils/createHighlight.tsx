import { Highlight } from '@/scripts/highlighter/components/Highlight';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { generateXPathForElement } from '@/scripts/highlighter/utils/highlightDataUtils';
import { createRoot } from 'react-dom/client';

const removeWhiteSpace = (text: string): string => {
	return text.replace(/\s+/g, ' ').trim();
};
const isInlineElement = (element: Node): boolean => {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
	const display = window.getComputedStyle(element as Element).display;
	return display.startsWith('inline');
};

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
	// Our general strategy is to find the entire text, and then go iterate back to fidn the startNode. This guarantees that we only start looking for the node once the entire searchstring is in the accumulated text. (ex. if prefix = "t" it will match really early)
	debugger;
	while (currentNode) {
		// if (currentNode.textContent === '\n') {
		// 	accumulatedText += currentNode.textContent;
		// } else {
		// 	accumulatedText += currentNode.textContent + '\n';
		// }

		accumulatedText += currentNode.textContent;

		if (accumulatedText.includes('drop an image')) debugger;
		// Check if a newline should be added
		// const nextWalker = document.createTreeWalker(
		// 	doc.body,
		// 	NodeFilter.SHOW_TEXT,
		// 	null
		// );
		// nextWalker.currentNode = currentNode;
		// const nextNode = nextWalker.nextNode();
		if (
			currentNode.nextSibling?.nodeType === Node.ELEMENT_NODE &&
			!isInlineElement(currentNode.nextSibling)
		) {
			accumulatedText += '\n';
		}

		// Once we have accumulated the text of the whole document, we stop at the textnode where our searchText is found
		// if (normalizedAccumulatedText.includes(normalizedSearchText)) {
		if (accumulatedText.includes(searchText)) {
			// Set the end node
			endNode = currentNode;

			// So problem 1: the entire body might not be in the current node
			// But we are guaranteed to be in the endNode, so we know the suffix will be in this node.

			//  Find the index where everything starts. Total text - the start of the search text + prefix + body = start of the suffix.
			// Total text - start of the search text removes all the accumulated text up until our desired searchstring
			const extraCharacters =
				accumulatedText.length -
				accumulatedText.indexOf(searchText) -
				highlightData.matching.surroundingText.prefix.length -
				highlightData.matching.body.length -
				1; /* 1 for the white space we add*/

			// extra characters - suffix length = characters from the end of the body
			endOffset = currentNode.textContent.length - extraCharacters;
			145;
			// WARNING: There could be chance the entire suffix isn't in this node?

			// Backtrack to find the start node
			let backtrackText = currentNode.textContent;
			let backtrackNode = currentNode;
			debugger;
			while (backtrackNode) {
				if (backtrackText.includes(searchText)) {
					startNode = backtrackNode;
					startOffset =
						backtrackText.indexOf(searchText) +
						highlightData.matching.surroundingText.prefix.length;

					// In case the suffix is in a previous textnode
					while (startOffset >= backtrackNode.textContent.length) {
						startOffset =
							startOffset - backtrackNode.textContent.length;
						backtrackNode = walker.nextNode();
					}
					startNode = backtrackNode;
					break;
				}
				backtrackNode = walker.previousNode();
				if (backtrackNode.textContent === '\n') {
					backtrackText =
						backtrackNode.textContent + '\n' + backtrackText;
				} else {
					backtrackText = backtrackNode.textContent + backtrackText;
				}
			}
			break;
		}

		currentNode = walker.nextNode();
	}
	debugger;
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
		createHighlightFromRange(highlightData);
	}
};

const createHighlightFromRange = (highlightData: HighlightData) => {
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

	debugger;
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

		// Reminder: change to "atEndNode" and flip the boolean values.
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
			if (
				currentNode === endNode ||
				currentNode.parentElement === endNode
			) {
				inHighlight = false;
			}

			const range = new Range();

			range.setStart(currentNode, startOffset);

			let endOffset = currentNode.length;

			// If in final container
			if (!inHighlight) {
				// If final container is smaller than character length, it may be because there's multiple text elements
				// This should never happen when using creatHighlightTextBased
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
	'range-based': createHighlightFromRange,
};

export const createHighlightElement = createHighlight[strategy];
