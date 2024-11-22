import { v4 as uuid } from 'uuid';

import {
	HighlightData,
	highlightColours,
} from '@/scripts/highlighter/types/HighlightData';
import {
	getArticleMetadata,
	getLinkIcon,
} from '@/scripts/ImageDrop/saveWebsite';
import { User } from '@supabase/supabase-js';

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

export const cleanUrl = (url: string): string => {
	// Check if it's a Substack URL
	if (url.includes('substack.com')) {
		// Remove all parameters by taking everything before the '?'
		const cleanedUrl = url.split('?')[0];
		return cleanedUrl;
	}
	return url;
};

export const extractHighlightData = (
	selection: Selection,
	user: User
): HighlightData | null => {
	if (!selection.rangeCount || selection.isCollapsed) {
		return null;
	}

	const firstRange = selection.getRangeAt(0);
	const lastRange = selection.getRangeAt(selection.rangeCount - 1);
	const { author, publishDate } = getArticleMetadata();

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
			walker.currentNode.textContent?.length
		);
	}

	const body = getSelectionWithNewlines(selection);
	const pageTitle = document.title;

	const highlightWords = extractWords(body);
	const pageTitleWords = extractWords(pageTitle);

	const highlightData: HighlightData = {
		uuid: uuid(),
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
		siteMetadata: {
			url: cleanUrl(window.location.href),
			title: document.title,
			favicon: getLinkIcon(),
			author: author,
			publishDate: publishDate,
		},
		rating: 0,
		color: highlightColours.YELLOW,
		notes: [],
		reactions: [],
		highlightWords: highlightWords,
		pageTitleWords: pageTitleWords,
		createdAt: new Date(),
		updatedAt: new Date(),
		user_meta: {
			name: user.user_metadata.name,
			picture: user.user_metadata.picture,
			email: user.email,
		},
		user_id: user.id,
	};

	return highlightData;
};

// Helper function to extract words from a string
export function extractWords(text: string): string[] {
	return text
		.toLowerCase()
		.split(/\s+/)
		.filter((word) => word.length > 0); // Remove empty strings
}

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
