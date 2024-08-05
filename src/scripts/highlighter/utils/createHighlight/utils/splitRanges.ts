import { HighlightData } from '@/scripts/highlighter/types/HighlightData';

export const createHighlightFromRange = (highlightData: HighlightData) => {
	const doc = document; // Adjust if working within iframes or other contexts
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

	const ranges = [];

	if (startNode && endNode) {
		// Create a TreeWalker to iterate text nodes between startNode and endNode
		const walker = document.createTreeWalker(
			doc.body,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: function (node) {
					if (node.nodeType === Node.TEXT_NODE) {
						if (node.nodeValue) {
							return NodeFilter.FILTER_ACCEPT;
						}
					}
					return NodeFilter.FILTER_REJECT;
				},
			}
		);

		walker.currentNode = startNode; // Start the walker at the startNode
		let currentNode: Node | null = walker.currentNode;

		// Reminder: change to "atEndNode" and flip the boolean values.
		let inHighlight = true;
		let characterLength =
			highlightData.matching.textPosition.end -
			highlightData.matching.textPosition.start;

		if (currentNode.nodeType !== Node.TEXT_NODE) {
			currentNode = walker.nextNode();
		}

		let startOffset = highlightData.matching.rangeSelector.startOffset;

		while (currentNode && inHighlight) {
			// If we're at the end node, stop highlighting after this loop.
			if (
				currentNode === endNode ||
				currentNode.parentElement === endNode
			) {
				inHighlight = false;
			}

			const range = new Range();

			range.setStart(currentNode, startOffset);
			// @ts-expect-error because we checked that this is a text node above
			let endOffset = currentNode.length;

			// If in final container
			if (!inHighlight) {
				// If final container is smaller than character length, it may be because there's multiple text elements
				// This should never happen when using creatHighlightTextBased
				// @ts-expect-error because we checked that this is a text node above
				if (currentNode.length < characterLength + startOffset) {
					inHighlight = true;
					// @ts-expect-error because we checked that this is a text node above
					endOffset = currentNode.length;
					characterLength -=
						endOffset -
						highlightData.matching.rangeSelector.startOffset;
					// if final container is smaller than character length,
				} else {
					endOffset = startOffset + characterLength;
				}
			} else {
				characterLength -= endOffset - startOffset;
			}

			startOffset = 0;

			range.setEnd(currentNode, endOffset);

			currentNode = walker.nextNode();
			const string = range.toString();

			if (string.trim() === '') continue;

			ranges.push(range);
		}
	}

	return ranges;
};
