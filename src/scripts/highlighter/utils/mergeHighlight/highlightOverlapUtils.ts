import { RangeSelector } from '@/scripts/highlighter/types/HighlightData';

export const rangesOverlap = (
	range1: RangeSelector,
	range2: RangeSelector
): boolean => {
	// This is a simplified check. You might need to enhance this based on your exact requirements
	return (
		range1.startContainer === range2.startContainer &&
		range1.endContainer === range2.endContainer &&
		!(
			range1.endOffset <= range2.startOffset ||
			range2.endOffset <= range1.startOffset
		)
	);
};

export const mergeRanges = (
	range1: RangeSelector,
	range2: RangeSelector
): RangeSelector => {
	// This assumes ranges are in the same container. Adjust if needed.
	return {
		startContainer: range1.startContainer,
		endContainer: range1.endContainer,
		startOffset: Math.min(range1.startOffset, range2.startOffset),
		endOffset: Math.max(range1.endOffset, range2.endOffset),
	};
};

export const mergeHighlightBodies = (body1: string, body2: string): string => {
	// This is a simple concatenation. You might want to implement more sophisticated merging logic.
	return body1.length > body2.length ? body1 : body2;
};
