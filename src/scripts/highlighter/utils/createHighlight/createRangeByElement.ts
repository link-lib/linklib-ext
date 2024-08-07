import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { isInlineElement } from '@/scripts/highlighter/utils/createHighlight/utils/isInlineElement';

export const createRangesByElement = (highlightData: HighlightData) => {
	const doc = document;
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

	const ranges: Range[] = [];

	if (startNode && endNode) {
		const walker = document.createTreeWalker(
			doc.body,
			NodeFilter.SHOW_TEXT,
			null
		);

		walker.currentNode = startNode;
		let currentNode: Node | null = walker.currentNode;
		let rangeStart: Node | null = null;
		let rangeStartOffset = highlightData.matching.rangeSelector.startOffset;

		while (currentNode) {
			if (!rangeStart) {
				if (currentNode.textContent?.trim() === '') {
					currentNode = walker.nextNode();
					continue;
				}
				rangeStart = currentNode;
				rangeStartOffset =
					currentNode === startNode
						? highlightData.matching.rangeSelector.startOffset
						: 0;
			}

			if (
				currentNode.parentNode?.nodeType === Node.ELEMENT_NODE &&
				!isInlineElement(currentNode.parentNode) &&
				currentNode.parentNode.lastChild === currentNode
			) {
				if (rangeStart) {
					const range = new Range();
					range.setStart(rangeStart, rangeStartOffset);
					if (currentNode === endNode) {
						range.setEnd(
							currentNode,
							highlightData.matching.rangeSelector.endOffset
						);
						if (range.toString().trim() !== '') {
							ranges.push(range);
						}
						break;
					} else {
						range.setEnd(currentNode, currentNode.length);
						if (range.toString().trim() !== '') {
							ranges.push(range);
						}
					}

					rangeStart = null;
				}
			}

			currentNode = walker.nextNode();
		}
	}

	return ranges;
};
