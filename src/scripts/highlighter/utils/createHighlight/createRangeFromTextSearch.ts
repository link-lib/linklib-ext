import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { isInlineElement } from '@/scripts/highlighter/utils/createHighlight/utils/isInlineElement';
import { createHighlightFromRange } from '@/scripts/highlighter/utils/createHighlight/utils/splitRanges';
import { generateXPathForElement } from '@/scripts/highlighter/utils/highlightDataUtils';

const findTextPositionNoWhitespace = (highlightData: HighlightData) => {
	const doc = document;
	const highlightWords = highlightData.highlightWords;
	const prefixWords = highlightData.matching.surroundingText.prefix.trim()
		? highlightData.matching.surroundingText.prefix.trim().split(/\s+/)
		: [];
	const suffixWords = highlightData.matching.surroundingText.suffix.trim()
		? highlightData.matching.surroundingText.suffix.trim().split(/\s+/)
		: [];

	const walker = document.createTreeWalker(
		doc.body,
		NodeFilter.SHOW_TEXT,
		null
	);

	let currentNode = walker.nextNode();
	const accumulatedWords: string[] = [];
	let startNode: Node | null = null;
	let endNode: Node | null = null;
	let startOffset = 0;
	let endOffset = 0;
	let currentIndex = 0;

	const findWordSequence = (
		words: string[],
		startIndex: number,
		endIndex: number
	) => {
		if (words.length === 0) return startIndex;

		for (let i = startIndex; i <= endIndex - words.length + 1; i++) {
			if (
				words.every((word, j) =>
					accumulatedWords[i + j]
						.toLowerCase()
						.includes(word.toLowerCase())
				)
			) {
				return words[0].toLowerCase() !==
					accumulatedWords[i].toLowerCase()
					? i - 1
					: i;
			}
		}
		return -1;
	};

	while (currentNode) {
		const nodeWords = currentNode.textContent?.trim().split(/\s+/) || [];
		accumulatedWords.push(...nodeWords);

		// Increment currentIndex by the number of words in the current node
		currentIndex += nodeWords.length;

		const highlightIndex = findWordSequence(
			highlightWords,
			0,
			accumulatedWords.length - 1
		);

		if (highlightIndex !== -1) {
			let prefixIndex = highlightIndex;
			let suffixIndex = highlightIndex + highlightWords.length;

			// Check for prefix if it exists
			if (prefixWords.length > 0) {
				const potentialPrefixIndex = findWordSequence(
					prefixWords,
					Math.max(0, highlightIndex - prefixWords.length - 1),
					highlightIndex
				);
				if (potentialPrefixIndex !== -1) {
					prefixIndex = potentialPrefixIndex;
				}
			}

			// Check for suffix if it exists
			if (suffixWords.length > 0) {
				const potentialSuffixIndex = findWordSequence(
					suffixWords,
					suffixIndex - 1,
					Math.min(
						accumulatedWords.length,
						suffixIndex + suffixWords.length
					)
				);
				if (potentialSuffixIndex !== -1) {
					suffixIndex = potentialSuffixIndex + suffixWords.length;
				}
			}

			// We've found the sequence, now find the nodes and offsets
			let node = walker.currentNode;
			currentIndex -= nodeWords.length;

			// Find start node and offset
			while (node && currentIndex <= prefixIndex) {
				startNode = node;
				const nodeWords = node.textContent?.trim().split(/\s+/) || [];
				if (currentIndex + nodeWords.length > prefixIndex) {
					const partialText =
						node.textContent?.substring(
							0,
							node.textContent.indexOf(
								accumulatedWords[prefixIndex]
							)
						) || '';
					startOffset = partialText.length;
					break;
				}
				currentIndex -= nodeWords.length;
				node = walker.previousNode();
			}

			// Find end node and offset
			node = startNode;
			while (node && currentIndex < suffixIndex) {
				endNode = node;
				const nodeWords = node.textContent?.trim().split(/\s+/) || [];
				if (currentIndex + nodeWords.length >= suffixIndex) {
					const lastWordIndex = suffixIndex - currentIndex - 1;
					const partialText =
						node.textContent?.substring(
							0,
							node.textContent.indexOf(nodeWords[lastWordIndex]) +
								nodeWords[lastWordIndex].length
						) || '';
					endOffset = partialText.length;
					break;
				}
				currentIndex += nodeWords.length;
				node = walker.nextNode();
			}

			break;
		}

		currentNode = walker.nextNode();
	}

	return { startNode, startOffset, endNode, endOffset };
};

export const createHighlightElementTextArrayBased = (
	highlightData: HighlightData
) => {
	const { startNode, startOffset, endNode, endOffset } =
		findTextPositionNoWhitespace(highlightData);

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
