import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { generateXPathForElement } from '../highlightDataUtils';
import { createHighlightFromRange } from '@/scripts/highlighter/utils/createHighlight/utils/splitRanges';

export const createRangeUsingWindowFind = (
	highlightData: HighlightData
): Range[] => {
	const searchText =
		highlightData.matching.surroundingText.prefix +
		highlightData.matching.body +
		highlightData.matching.surroundingText.suffix;

	// Clear any existing selection
	window.getSelection()?.removeAllRanges();

	// Use window.find() to locate the text
	// @ts-expect-error because we checked that this is a text node above
	if (window.find(searchText, false, false, true, false, true, false)) {
		const selection = window.getSelection();
		if (selection && selection.rangeCount > 0) {
			const foundRange = selection.getRangeAt(0);
			const prefixLength =
				highlightData.matching.surroundingText.prefix.length;
			const bodyLength = highlightData.matching.body.length;

			// Create a new range for the exact highlight
			const highlightRange = document.createRange();
			highlightRange.setStart(
				foundRange.startContainer,
				foundRange.startOffset + prefixLength
			);

			// If the highlight spans multiple nodes, we need to find the correct end node and offset
			let currentNode = foundRange.startContainer;
			let remainingLength = prefixLength + bodyLength;
			let endNode = currentNode;
			let endOffset = foundRange.startOffset + prefixLength;

			while (remainingLength > 0 && currentNode) {
				if (currentNode.nodeType === Node.TEXT_NODE) {
					const nodeLength = currentNode.textContent?.length || 0;
					if (remainingLength <= nodeLength) {
						endNode = currentNode;
						endOffset = Math.min(
							nodeLength,
							endOffset + remainingLength
						);
						break;
					}
					remainingLength -= nodeLength;
				}
				currentNode = getNextTextNode(currentNode);
				if (currentNode) {
					endNode = currentNode;
					endOffset = 0;
				}
			}

			highlightRange.setEnd(endNode, endOffset);

			// Update highlightData
			highlightData.matching.rangeSelector = {
				startContainer: generateXPathForElement(
					highlightRange.startContainer
				),
				endContainer: generateXPathForElement(
					highlightRange.endContainer
				),
				startOffset: highlightRange.startOffset,
				endOffset: highlightRange.endOffset,
			};

			return createHighlightFromRange(highlightData);
		}
	}

	return [];
};

// Helper function to get the next text node
const getNextTextNode = (node: Node): Node | null => {
	let next = node.nextSibling;
	while (next) {
		if (next.nodeType === Node.TEXT_NODE && next.textContent?.trim()) {
			return next;
		}
		if (next.firstChild) {
			next = next.firstChild;
		} else if (next.nextSibling) {
			next = next.nextSibling;
		} else {
			while (next && !next.nextSibling) {
				// @ts-expect-error because we checked that this is a text node above
				next = next.parentNode;
			}
			next = next ? next.nextSibling : null;
		}
	}
	return null;
};
