import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { createHighlightFromRange } from '@/scripts/highlighter/utils/createHighlight/utils/splitRanges';
import { generateXPathForElement } from '@/scripts/highlighter/utils/highlightDataUtils';

function restoreHighlight(highlightData: HighlightData): Range | null {
	const doc = document;
	const fullText = doc.body.innerText;
	const { start, end } = highlightData.matching.textPosition;
	const highlightText = highlightData.matching.body;

	// Step 1: Try exact matching using textPosition
	if (fullText.slice(start, end) === highlightText) {
		return createRangeFromPositions(doc.body, start, end);
	}

	// Step 2: Fuzzy matching
	const fuzzyMatch = findFuzzyMatch(fullText, highlightText);
	if (fuzzyMatch) {
		const { matchStart, matchEnd } = fuzzyMatch;
		return createRangeFromPositions(doc.body, matchStart, matchEnd);
	}

	// Step 3: Use surrounding text as fallback
	const surroundingMatch = findSurroundingTextMatch(
		fullText,
		highlightData.matching.surroundingText.prefix,
		highlightText,
		highlightData.matching.surroundingText.suffix
	);
	if (surroundingMatch) {
		const { matchStart, matchEnd } = surroundingMatch;
		return createRangeFromPositions(doc.body, matchStart, matchEnd);
	}

	return null;
}

function createRangeFromPositions(
	root: Node,
	start: number,
	end: number
): Range {
	const range = document.createRange();
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
	let charCount = 0;
	let startNode, endNode, startOffset, endOffset;

	while (walker.nextNode()) {
		const node = walker.currentNode;
		const nodeLength = node.textContent?.length || 0;

		if (!startNode && charCount + nodeLength > start) {
			startNode = node;
			startOffset = start - charCount;
		}

		if (charCount + nodeLength >= end) {
			endNode = node;
			endOffset = end - charCount;
			break;
		}

		charCount += nodeLength;
	}

	if (startNode && endNode && startOffset && endOffset) {
		range.setStart(startNode, startOffset);
		range.setEnd(endNode, endOffset);
		return range;
	}

	throw new Error('Could not create range');
}

function findFuzzyMatch(
	fullText: string,
	highlightText: string
): { matchStart: number; matchEnd: number } | null {
	const minMatchScore = 0.8; // Minimum similarity score to consider a match
	const maxLengthDifference = 0.2; // Maximum allowed length difference as a percentage of highlightText length

	let bestMatch: {
		matchStart: number;
		matchEnd: number;
		score: number;
	} | null = null;

	// Slide a window of highlightText length over fullText
	for (let i = 0; i <= fullText.length - highlightText.length; i++) {
		const substring = fullText.substr(i, highlightText.length);
		const lengthDifference =
			Math.abs(substring.length - highlightText.length) /
			highlightText.length;

		// Only consider substrings with similar length
		if (lengthDifference <= maxLengthDifference) {
			const score =
				1 -
				levenshteinDistance(substring, highlightText) /
					Math.max(substring.length, highlightText.length);

			if (
				score >= minMatchScore &&
				(!bestMatch || score > bestMatch.score)
			) {
				bestMatch = {
					matchStart: i,
					matchEnd: i + substring.length,
					score,
				};
			}
		}
	}

	return bestMatch
		? { matchStart: bestMatch.matchStart, matchEnd: bestMatch.matchEnd }
		: null;
}

function levenshteinDistance(a: string, b: string): number {
	const matrix: number[][] = [];

	// Initialize the matrix
	for (let i = 0; i <= b.length; i++) {
		matrix[i] = [i];
	}
	for (let j = 0; j <= a.length; j++) {
		matrix[0][j] = j;
	}

	// Fill in the rest of the matrix
	for (let i = 1; i <= b.length; i++) {
		for (let j = 1; j <= a.length; j++) {
			if (b.charAt(i - 1) === a.charAt(j - 1)) {
				matrix[i][j] = matrix[i - 1][j - 1];
			} else {
				matrix[i][j] = Math.min(
					matrix[i - 1][j - 1] + 1, // substitution
					matrix[i][j - 1] + 1, // insertion
					matrix[i - 1][j] + 1 // deletion
				);
			}
		}
	}

	return matrix[b.length][a.length];
}

function findSurroundingTextMatch(
	fullText: string,
	prefix: string,
	highlightText: string,
	suffix: string
): { matchStart: number; matchEnd: number } | null {
	const regex = new RegExp(
		`${escapeRegExp(prefix)}(${escapeRegExp(highlightText)})${escapeRegExp(
			suffix
		)}`,
		'i'
	);
	const match = fullText.match(regex);
	if (match && match.index !== undefined) {
		return {
			matchStart: match.index + prefix.length,
			matchEnd: match.index + prefix.length + highlightText.length,
		};
	}
	return null;
}

function escapeRegExp(string: string): string {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

export const createHighlightElementClaudeBased = (
	highlightData: HighlightData
) => {
	const range = restoreHighlight(highlightData);

	if (!range) return [];
	const {
		startOffset,
		startContainer: startNode,
		endContainer: endNode,
		endOffset,
	} = range;

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
};
