import { v4 as uuid } from 'uuid';

import {
	HighlightData,
	highlightColours,
} from '@/scripts/highlighter/types/HighlightData';

export const extractHighlightData = (
	selection: Selection
): HighlightData | null => {
	if (!selection.rangeCount || selection.isCollapsed) {
		return null;
	}

	const firstRange = selection.getRangeAt(0);
	const lastRange = selection.getRangeAt(selection.rangeCount - 1);

	const highlightData: HighlightData = {
		uuid: uuid(),
		url: window.location.href,
		pageTitle: document.title,
		matching: {
			body: selection.toString().replace(/\n+$/, ''),
			textPosition: {
				start: calculateAbsolutePosition(
					firstRange.startContainer,
					firstRange.startOffset
				),
				end: calculateAbsolutePosition(
					lastRange.endContainer,
					lastRange.endOffset
				),
			},
			rangeSelector: {
				startOffset: firstRange.startOffset,
				endOffset: lastRange.endOffset,
				startContainer: generateXPathForElement(
					firstRange.startContainer
				),
				endContainer: generateXPathForElement(lastRange.endContainer),
			},
			surroundingText: {
				prefix: extractSurroundingText(
					firstRange.startContainer,
					firstRange.startOffset,
					'backward'
				),
				suffix: extractSurroundingText(
					lastRange.endContainer,
					lastRange.endOffset,
					'forward'
				),
			},
		},
		rating: 0,
		color: highlightColours.YELLOW,
		note: '',
		highlightWords: [],
		pageTitleWords: [],
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return highlightData;
};

export const generateXPathForElement = (element: Node): string => {
	if (
		element.nodeType !== Node.ELEMENT_NODE &&
		element.nodeType !== Node.TEXT_NODE
	) {
		element = element.parentNode!;
	}
	const paths: string[] = [];
	while (element) {
		let index = 1; // Start index from 1
		let sibling = element.previousSibling;
		while (sibling) {
			// Check if sibling is of the same node type and has the same tag name
			if (
				sibling.nodeType === element.nodeType &&
				sibling.nodeName === element.nodeName
			) {
				index++;
			}
			sibling = sibling.previousSibling;
		}
		const tagName =
			element.nodeType === Node.TEXT_NODE
				? 'text()'
				: element.nodeName.toLowerCase();
		const pathIndex = `[${index}]`; // Always include index
		paths.unshift(`${tagName}${pathIndex}`);
		element = element.parentNode!;
	}
	let xpath = paths.length ? `/${paths.join('/')}` : '';
	// Remove the #document part if it exists
	xpath = xpath.replace('/#document[1]', '');
	return xpath;
};

const extractSurroundingText = (
	container: Node,
	offset: number,
	direction: 'forward' | 'backward'
): string => {
	let textContent = '';
	let currentNode = container;

	// If you double clck on a paragraph, the endContainer endOffset is the followng paragraph for some reaosn
	if (
		direction === 'forward' &&
		container.nodeType === Node.ELEMENT_NODE &&
		offset === 0
	) {
		return '';
	}

	// Start collecting text from the correct position in the text node
	if (currentNode.nodeType === Node.TEXT_NODE) {
		const text = currentNode.textContent || '';
		textContent =
			direction === 'backward'
				? text.substring(0, offset)
				: text.substring(offset);
	}

	// Navigate through sibling nodes to collect additional text
	while (textContent.split(/\s+/).filter(Boolean).length < 5) {
		currentNode =
			direction === 'backward'
				? (currentNode.previousSibling as Node)
				: (currentNode.nextSibling as Node);
		while (currentNode && currentNode.nodeType !== Node.TEXT_NODE) {
			// Skip non-text nodes, navigating deeper if necessary
			currentNode =
				direction === 'backward'
					? (currentNode.lastChild as Node)
					: (currentNode.firstChild as Node);
		}
		if (!currentNode) break; // Stop if there are no more text nodes

		const additionalText = currentNode.textContent || '';
		textContent =
			direction === 'backward'
				? additionalText + textContent
				: textContent + additionalText;
	}

	let words = textContent.split(/\s+/);
	if (direction === 'backward') {
		words = words.slice(-5);
	} else {
		words = words.slice(0, 5);
	}

	return words.filter((word) => word !== '').join(' ');
};

const calculateAbsolutePosition = (node: Node, offset: number): number => {
	debugger;
	let position = 0;
	const walker = document.createTreeWalker(
		document.body,
		NodeFilter.SHOW_TEXT,
		null
	);

	let currentNode;
	while ((currentNode = walker.nextNode())) {
		if (currentNode === node) {
			position += offset;
			break;
		}
		position += currentNode.textContent?.length || 0;
	}

	return position;
};
