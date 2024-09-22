import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { createHighlightFromRangePure } from '@/scripts/highlighter/utils/createHighlight/utils/splitRanges';
import { generateXPathForElement } from '@/scripts/highlighter/utils/highlightDataUtils';

interface WordPosition {
	word: string;
	charStart: number; // Character index where the word starts in the node
	charEnd: number; // Character index where the word ends in the node
	node: Node; // Reference to the text node
}

export const createHighlightElementTextArrayBasedDeterministic = (
	highlightData: HighlightData
) => {
	const { startNode, startOffset, endNode, endOffset } =
		findTextPositionDeterministic(highlightData);

	if (startNode && endNode) {
		// Update the highlightData with the current start and end containers
		highlightData.matching.rangeSelector.startContainer =
			generateXPathForElement(startNode);
		highlightData.matching.rangeSelector.endContainer =
			generateXPathForElement(endNode);
		highlightData.matching.rangeSelector.startOffset = startOffset;
		highlightData.matching.rangeSelector.endOffset = endOffset;

		// Use the range-based method to create the highlight
		const containers = createHighlightFromRangePure(highlightData);

		return containers;
	}

	return [];
};

const findTextPositionDeterministic = (
	highlightData: HighlightData
): {
	startNode: Node | null;
	startOffset: number;
	endNode: Node | null;
	endOffset: number;
} => {
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
	const accumulatedWords: WordPosition[] = [];
	let startNode: Node | null = null;
	let endNode: Node | null = null;
	let currentIndex = 0;
	let startOffset = 0;
	let endOffset = 0;

	const findWordSequence = (
		words: string[],
		startIndex: number,
		endIndex: number
	): number => {
		if (words.length === 0) return startIndex;

		for (let i = startIndex; i <= endIndex - words.length + 1; i++) {
			let match = true;

			for (let j = 0; j < words.length; j++) {
				const accumulatedWord =
					accumulatedWords[i + j].word.toLowerCase();
				const searchWord = words[j].toLowerCase();

				// Determine if it's the first or last word in the sequence
				const isFirstWord = j === 0;
				const isLastWord = j === words.length - 1;

				if (isFirstWord || isLastWord) {
					// Allow partial matches for first and last words
					if (!accumulatedWord.includes(searchWord)) {
						match = false;
						break;
					}
				} else {
					// Require full matches for middle words
					if (accumulatedWord !== searchWord) {
						match = false;
						break;
					}
				}
			}

			if (match) {
				return i;
			}
		}
		return -1;
	};

	while (currentNode) {
		const textContent = currentNode.textContent?.trim() || '';
		const words = textContent.split(/\s+/);
		let charPointer = 0;
		currentIndex = accumulatedWords.length;

		words.forEach((word) => {
			const wordStart = textContent.indexOf(word, charPointer);
			const wordEnd = wordStart + word.length;
			accumulatedWords.push({
				word,
				charStart: wordStart,
				charEnd: wordEnd,
				node: currentNode,
			});
			charPointer = wordEnd + 1; // +1 for the space
		});

		const highlightIndex = findWordSequence(
			highlightWords,
			currentIndex,
			accumulatedWords.length - 1
		);

		if (highlightIndex !== -1) {
			let prefixIndex = highlightIndex;
			let suffixIndex = highlightIndex + highlightWords.length;

			// Handle prefix words
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

			// Handle suffix words
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

			// Calculate startNode and startOffset
			// Calculate startNode and startOffset
			const startWord = accumulatedWords[prefixIndex];
			startNode = startWord.node;
			// startOffset = calculateAdjustedOffsets(
			// 	startWord,
			// 	highlightWords[0],
			// 	true
			// );
			startOffset = startWord.charStart;

			// Calculate endNode and endOffset
			const endWord = accumulatedWords[suffixIndex - 1];
			endNode = endWord.node;
			// endOffset =
			// 	calculateAdjustedOffsets(
			// 		endWord,
			// 		highlightWords[highlightWords.length - 1],
			// 		false
			// 	) + 1;
			endOffset = endWord.charEnd;

			break;
		}

		currentNode = walker.nextNode();
	}

	return { startNode, startOffset, endNode, endOffset };
};

const calculateAdjustedOffsets = (
	wordPosition: WordPosition,
	searchWord: string,
	isStart: boolean
): number => {
	const accumulatedWord = wordPosition.word;
	const normalizedAccumulated = accumulatedWord.toLowerCase();
	const normalizedSearch = searchWord.toLowerCase();

	if (isStart) {
		if (normalizedAccumulated.startsWith(normalizedSearch)) {
			// Exact match or search word is a prefix of accumulated word
			return wordPosition.charStart;
		} else if (normalizedSearch.startsWith(normalizedAccumulated)) {
			// Highlight starts inside the accumulated word
			return wordPosition.charStart + normalizedAccumulated.length;
		} else {
			// Partial match somewhere inside the word
			const index = normalizedAccumulated.indexOf(normalizedSearch);
			if (index !== -1) {
				return wordPosition.charStart + index;
			}
		}
	} else {
		if (normalizedAccumulated.startsWith(normalizedSearch)) {
			// Highlight ends inside the accumulated word
			return wordPosition.charStart + normalizedSearch.length;
		} else if (normalizedSearch.startsWith(normalizedAccumulated)) {
			// Exact match or search word is a suffix of accumulated word
			return wordPosition.charEnd;
		} else {
			// Partial match somewhere inside the word
			const index = normalizedAccumulated.indexOf(normalizedSearch);
			if (index !== -1) {
				return wordPosition.charStart + index + normalizedSearch.length;
			}
		}
	}

	// Default fallback
	return isStart ? wordPosition.charStart : wordPosition.charEnd;
};
