import { HighlightData } from '@/scripts/highlighter/types/HighlightData';

/**
 * Checks if two highlights overlap.
 * @param a First HighlightData
 * @param b Second HighlightData
 * @returns Boolean indicating overlap
 */
export const checkOverlap = (a: HighlightData, b: HighlightData): boolean => {
	return (
		a.matching.textPosition.start <= b.matching.textPosition.end &&
		a.matching.textPosition.end >= b.matching.textPosition.start
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
