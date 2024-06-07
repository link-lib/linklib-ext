import {
	HighlightData,
	highlightColours,
} from '@/scripts/highlighter/types/HighlightData';

export const extractHighlightData = (): HighlightData | null => {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
		return null;
	}

	const range = selection.getRangeAt(0);
	const start = calculateAbsolutePosition(
		range.startContainer,
		range.startOffset
	);
	const end = calculateAbsolutePosition(range.endContainer, range.endOffset);

	const highlightData: HighlightData = {
		url: window.location.href,
		pageTitle: document.title,
		matching: {
			body: range.toString(),
			textPosition: {
				start: start,
				end: end,
			},
			rangeSelector: {
				startOffset: range.startOffset,
				endOffset: range.endOffset,
				startContainer: generateXPathForElement(range.startContainer),
				endContainer: generateXPathForElement(range.endContainer),
			},
			surroundingText: {
				text: range.toString(),
				prefix: extractSurroundingText(
					range.startContainer,
					range.startOffset,
					'backward'
				),
				suffix: extractSurroundingText(
					range.endContainer,
					range.endOffset,
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

const generateXPathForElement = (element: Node): string => {
	if (element.nodeType !== Node.ELEMENT_NODE) {
		element = element.parentNode!;
	}
	const paths: string[] = [];
	while (element && element.nodeType === Node.ELEMENT_NODE) {
		let index = 1; // Start index from 1
		let sibling = element.previousSibling;
		while (sibling) {
			// Check if sibling is of the same node type and has the same tag name
			if (
				sibling.nodeType === Node.ELEMENT_NODE &&
				sibling.nodeName === element.nodeName
			) {
				index++;
			}
			sibling = sibling.previousSibling;
		}
		const tagName = element.nodeName.toLowerCase();
		const pathIndex = `[${index}]`; // Always include index
		paths.unshift(`${tagName}${pathIndex}`);
		element = element.parentNode!;
	}
	return paths.length ? `/${paths.join('/')}` : '';
};

const extractSurroundingText = (
	container: Node,
	offset: number,
	direction: 'forward' | 'backward'
): string => {
	let textContent = '';
	let currentNode = container;

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
				? additionalText + ' ' + textContent
				: textContent + ' ' + additionalText;
	}

	let words = textContent.split(/\s+/).filter(Boolean);
	if (direction === 'backward') {
		words = words.slice(-5);
	} else {
		words = words.slice(0, 5);
	}

	return words.join(' ');
};

const calculateAbsolutePosition = (node: Node, offset: number): number => {
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
