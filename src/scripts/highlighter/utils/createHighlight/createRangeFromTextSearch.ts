import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { isInlineElement } from '@/scripts/highlighter/utils/createHighlight/utils/isInlineElement';
import { createHighlightFromRange } from '@/scripts/highlighter/utils/createHighlight/utils/splitRanges';
import { generateXPathForElement } from '@/scripts/highlighter/utils/highlightDataUtils';

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
	while (currentNode) {
		accumulatedText += currentNode.textContent;

		if (
			currentNode.nextSibling?.nodeType === Node.ELEMENT_NODE &&
			!isInlineElement(currentNode.nextSibling)
		) {
			accumulatedText += '\n';
		}

		// if (accumulatedText.includes('with the image')) debugger;

		if (accumulatedText.includes(searchText)) {
			// Once we have accumulated the text of the whole document, we stop at the textnode where our searchText is found

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
			// @ts-expect-error because we checked that this is a text node above
			endOffset = currentNode.textContent.length - extraCharacters;

			// WARNING: There could be chance the entire suffix isn't in this node?
			// WARNING: Or a chance the entire

			// Backtrack to find the start node
			let backtrackText = currentNode.textContent || '';
			let backtrackNode = currentNode;
			while (backtrackNode) {
				if (backtrackText.includes(searchText)) {
					startNode = backtrackNode;
					startOffset =
						backtrackText.indexOf(searchText) +
						highlightData.matching.surroundingText.prefix.length;

					// In case the suffix is in a previous textnode
					// @ts-expect-error because we checked that this is a text node above
					while (startOffset >= backtrackNode.textContent.length) {
						startOffset =
							// @ts-expect-error because we checked that this is a text node above
							startOffset - backtrackNode.textContent.length;
						// @ts-expect-error because we checked that this is a text node above
						backtrackNode = walker.nextNode();
					}
					startNode = backtrackNode;
					break;
				}
				// @ts-expect-error because we checked that this is a text node above
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
	// debugger;
	return { startNode, startOffset, endNode, endOffset };
};

export const createHighlightElementTextBased = (
	highlightData: HighlightData
) => {
	const { startNode, startOffset, endNode, endOffset } =
		findTextPosition(highlightData);

	if (startNode && endNode) {
		// Update the highlightData with the current start and end containers
		highlightData.matching.rangeSelector.startContainer =
			generateXPathForElement(startNode);
		highlightData.matching.rangeSelector.endContainer =
			generateXPathForElement(endNode);
		highlightData.matching.rangeSelector.startOffset = startOffset;
		highlightData.matching.rangeSelector.endOffset = endOffset;

		// Use the range-based method to create the highlight
		const containers = createHighlightFromRange(highlightData);

		return containers;
	}
	return [];
};
