import { v4 as uuid } from 'uuid';

import {
	HighlightData,
	highlightColours,
} from '@/scripts/highlighter/types/HighlightData';

function getSelectionWithNewlines(selection: Selection): string {
	if (selection.rangeCount === 0) return '';

	const range = selection.getRangeAt(0);
	const fragment = range.cloneContents();
	const div = document.createElement('div');
	div.appendChild(fragment);

	// Function to recursively process nodes
	function processNode(node: Node): string {
		if (node.nodeType === Node.TEXT_NODE) {
			return node.textContent || '';
		}
		if (node.nodeType === Node.ELEMENT_NODE) {
			const element = node as Element;
			if (element.tagName === 'BR') {
				return '\n';
			}
			if (window.getComputedStyle(element).display === 'block') {
				return (
					'\n' +
					Array.from(element.childNodes).map(processNode).join('') +
					'\n'
				);
			}
		}
		return Array.from(node.childNodes).map(processNode).join('');
	}

	const body = processNode(div).trim();
	return body;
}

('/html[1]/body[1]/div[7]/div[2]/div[1]/div[1]/div[3]/div[1]/div[2]/div[2]/div[1]/p[5]/text()[2]');
('/html[1]/body[1]/div[7]/div[2]/div[1]/div[1]/div[3]/div[1]/div[2]/div[2]/div[1]/p[6]/strong[1]/text()[1]');

export const extractHighlightData = (
	selection: Selection
): HighlightData | null => {
	if (!selection.rangeCount || selection.isCollapsed) {
		return null;
	}

	const firstRange = selection.getRangeAt(0);
	const lastRange = selection.getRangeAt(selection.rangeCount - 1);

	if (
		lastRange.endContainer.nodeType === Node.ELEMENT_NODE &&
		lastRange.endOffset === 0
	) {
		const walker = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT,
			{
				acceptNode: function (node) {
					if (node.nodeType === Node.TEXT_NODE) {
						if (node.nodeValue && node.nodeValue.trim() !== '') {
							return NodeFilter.FILTER_ACCEPT;
						}
					}
					return NodeFilter.FILTER_REJECT;
				},
			}
		);
		// Create a tree walker that goes back until the the closest previous text node, and set lastRange endContainer to that and endOffset to the end of that container
		walker.currentNode = lastRange.endContainer;
		while (walker.currentNode.nodeType !== Node.TEXT_NODE) {
			walker.previousNode();
		}
		lastRange.setEnd(
			walker.currentNode,
			// @ts-expect-error because we checked that this is a text node above
			walker.currentNode.textContent?.length
		);
	}

	const body = getSelectionWithNewlines(selection);

	const highlightData: HighlightData = {
		uuid: uuid(),
		url: window.location.href,
		pageTitle: document.title,
		matching: {
			body: body,
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
				startContainerObj: firstRange.startContainer,
				endContainerObj: lastRange.endContainer,
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
	const currentNode = container;

	// Start collecting text from the correct position in the text node
	if (currentNode.nodeType === Node.TEXT_NODE) {
		const text = currentNode.textContent || '';
		textContent =
			direction === 'backward'
				? text.substring(0, offset)
				: text.substring(offset);
	}

	let words = textContent.split(/\s+/);

	if (direction === 'backward') {
		words = words.slice(-5);
	} else {
		words = words.slice(0, 5);
	}

	if (words.every((word) => word === '')) {
		return '';
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
