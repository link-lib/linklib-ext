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

	/**
	 * Searches for a sequence of words within accumulatedWords between startIndex and endIndex.
	 * Allows partial matches for the first and last words in the sequence.
	 *
	 * @param words - The sequence of words to search for.
	 * @param startIndex - The starting index in accumulatedWords to begin the search.
	 * @param endIndex - The ending index in accumulatedWords to end the search.
	 * @param instance - The occurrence number to find (default is 1 for the first instance).
	 * @returns The starting index of the specified instance if found; otherwise, -1.
	 */
	const findWordSequence = (
		words: string[],
		startIndex: number,
		endIndex: number,
		instance: number = 1
	): number => {
		if (words.length === 0) return startIndex;

		let matchCount = 0; // Counter for the number of matches found

		// i + words.length - 1 = accumulatedWords.length - 1
		for (
			let i = Math.max(startIndex, 0);
			i <=
			Math.min(
				endIndex - words.length + 1,
				accumulatedWords.length - words.length
			);
			i++
		) {
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
				matchCount++;
				if (matchCount === instance) {
					return i; // Return the starting index of the desired instance
				}
			}
		}

		return -1; // Desired instance not found
	};

	while (currentNode) {
		const textContent = currentNode.textContent || '';
		const words = textContent.trim().split(/\s+/);
		let charPointer = 0;
		// currentIndex = accumulatedWords.length;

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

		if (prefixWords.length === 0) {
			for (let i = 1; i < words.length; i++) {
				const highlightIndex = findWordSequence(
					highlightWords,
					currentIndex,
					accumulatedWords.length - 1,
					i
				);

				if (highlightIndex === -1) {
					currentIndex =
						accumulatedWords.length - highlightWords.length - 1;
					break;
				}

				const suffixIndex = findWordSequence(
					suffixWords,
					highlightIndex + highlightWords.length - 1,
					Math.min(
						highlightIndex +
							highlightWords.length +
							suffixWords.length +
							1,
						accumulatedWords.length - 1
					)
				);

				if (suffixIndex === -1) {
					continue;
				}

				const startWord = accumulatedWords[highlightIndex];
				startNode = startWord.node;
				startOffset = startWord.charStart;
				// calculate partial word highlights
				if (startWord.word.toLowerCase() !== highlightWords[0]) {
					startOffset +=
						startWord.word.length - highlightWords[0].length;
				}

				const endWord =
					accumulatedWords[
						highlightIndex + highlightWords.length - 1
					];
				endNode = endWord.node;
				endOffset = endWord.charEnd;

				// calculate partial word highlights
				if (
					endWord.word.toLowerCase() !==
					highlightWords[highlightWords.length - 1]
				) {
					endOffset -=
						endWord.word.length -
						highlightWords[highlightWords.length - 1].length;
				}

				return { startNode, startOffset, endNode, endOffset };
			}
		} else {
			// the number of occurenc
			for (let i = 1; i < words.length; i++) {
				const prefixIndex = findWordSequence(
					prefixWords,
					Math.min(
						currentIndex,
						accumulatedWords.length -
							words.length -
							prefixWords.length
					),
					accumulatedWords.length - 1,
					i
				);

				if (prefixIndex === -1) {
					currentIndex =
						accumulatedWords.length - prefixWords.length - 1;
					break;
				}

				const highlightIndex = findWordSequence(
					highlightWords,
					Math.max(prefixIndex + prefixWords.length - 1, 0),
					prefixIndex + prefixWords.length + highlightWords.length + 1
				);

				if (highlightIndex === -1) {
					if (prefixWords.length === 0) break;
					continue;
				}

				const suffixIndex = findWordSequence(
					suffixWords,
					highlightIndex + highlightWords.length - 1,
					Math.min(
						highlightIndex +
							highlightWords.length +
							suffixWords.length +
							1,
						accumulatedWords.length - 1
					)
				);

				if (suffixIndex === -1) {
					continue;
				}

				const startWord = accumulatedWords[highlightIndex];
				startNode = startWord.node;
				// startOffset = calculateAdjustedOffsets(
				// 	startWord,
				// 	highlightWords[0],
				// 	true
				// );
				startOffset = startWord.charStart;

				// Calculate endNode and endOffset
				const endWord =
					accumulatedWords[
						highlightIndex + highlightWords.length - 1
					];
				endNode = endWord.node;
				// endOffset =
				// 	calculateAdjustedOffsets(
				// 		endWord,
				// 		highlightWords[highlightWords.length - 1],
				// 		false
				// 	) + 1;
				endOffset = endWord.charEnd;

				return { startNode, startOffset, endNode, endOffset };
			}
		}

		currentNode = walker.nextNode();
	}

	return { startNode, startOffset, endNode, endOffset };
};
