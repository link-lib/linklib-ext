import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { createRangesByElement } from '@/scripts/highlighter/utils/createHighlight/createRangeByElement';

import {
	createHighlightElementTextArrayBased,
	createHighlightElementTextBased,
} from '@/scripts/highlighter/utils/createHighlight/createRangeFromTextSearch';
import { createRangeUsingWindowFind } from '@/scripts/highlighter/utils/createHighlight/createRangeUsingWindowFind';
import { createHighlightFromRange } from '@/scripts/highlighter/utils/createHighlight/utils/splitRanges';
import { createHighlightElementClaudeBased } from '@/scripts/highlighter/utils/createHighlight/createRangesClaude';
import { createHighlightElementTextArrayBasedDeterministic } from '@/scripts/highlighter/utils/createHighlight/createRangeo1';

export const createElementFallbackOrder = [
	'text-array-based-o1',
	'text-array-based',
	'text-based',
	'text-window-find',
	'range-based',
	'element-range',
	'claude-3.5-restore',
];

export const createHighlight = {
	'text-array-based-o1': createHighlightElementTextArrayBasedDeterministic,
	'text-array-based': createHighlightElementTextArrayBased,
	'text-based': createHighlightElementTextBased,
	'text-window-find': createRangeUsingWindowFind,
	'range-based': createHighlightFromRange,
	'element-range': createRangesByElement,
	'claude-3.5-restore': createHighlightElementClaudeBased,
};

export const createHighlightElement = createHighlight['element-range'];

export const checkOverlap = (
	existing: HighlightData,
	newHighlight: HighlightData
): boolean => {
	const existingStart = existing.matching.textPosition.start;
	const existingEnd = existing.matching.textPosition.end;
	const newStart = newHighlight.matching.textPosition.start;
	const newEnd = newHighlight.matching.textPosition.end;

	return (
		(newStart >= existingStart && newStart <= existingEnd) ||
		(newEnd >= existingStart && newEnd <= existingEnd) ||
		(newStart <= existingStart && newEnd >= existingEnd)
	);
};

export const extendHighlight = (
	existing: HighlightData,
	newHighlight: HighlightData
): HighlightData => {
	const start = Math.min(
		existing.matching.textPosition.start,
		newHighlight.matching.textPosition.start
	);
	const end = Math.max(
		existing.matching.textPosition.end,
		newHighlight.matching.textPosition.end
	);

	// Determine which highlight starts first
	const [firstHighlight, secondHighlight] =
		existing.matching.textPosition.start <
		newHighlight.matching.textPosition.start
			? [existing, newHighlight]
			: [newHighlight, existing];

	// Calculate the overlap
	const overlapStart = Math.max(
		firstHighlight.matching.textPosition.start,
		secondHighlight.matching.textPosition.start
	);
	const overlapEnd = Math.min(
		firstHighlight.matching.textPosition.end,
		secondHighlight.matching.textPosition.end
	);

	// Construct the merged body
	let mergedBody = firstHighlight.matching.body;

	if (overlapStart > firstHighlight.matching.textPosition.start) {
		// If there's non-overlapping content at the start of the second highlight
		mergedBody += secondHighlight.matching.body.slice(
			0,
			overlapStart - secondHighlight.matching.textPosition.start
		);
	}

	if (overlapEnd < secondHighlight.matching.textPosition.end) {
		// If there's non-overlapping content at the end of the second highlight
		mergedBody += secondHighlight.matching.body.slice(
			overlapEnd - secondHighlight.matching.textPosition.start
		);
	}

	return {
		...existing,
		matching: {
			...existing.matching,
			body: mergedBody,
			textPosition: { start, end },
			rangeSelector: {
				startOffset: Math.min(
					existing.matching.rangeSelector.startOffset,
					newHighlight.matching.rangeSelector.startOffset
				),
				endOffset: Math.max(
					existing.matching.rangeSelector.endOffset,
					newHighlight.matching.rangeSelector.endOffset
				),
				startContainer:
					start === existing.matching.textPosition.start
						? existing.matching.rangeSelector.startContainer
						: newHighlight.matching.rangeSelector.startContainer,
				endContainer:
					end === existing.matching.textPosition.end
						? existing.matching.rangeSelector.endContainer
						: newHighlight.matching.rangeSelector.endContainer,
			},
			surroundingText: {
				prefix:
					start === existing.matching.textPosition.start
						? existing.matching.surroundingText.prefix
						: newHighlight.matching.surroundingText.prefix,
				suffix:
					end === existing.matching.textPosition.end
						? existing.matching.surroundingText.suffix
						: newHighlight.matching.surroundingText.suffix,
			},
		},
		updatedAt: new Date(),
	};
};
