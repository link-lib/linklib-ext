export const isInlineElement = (element: Node): boolean => {
	if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
	const display = window.getComputedStyle(element as Element).display;
	return display.startsWith('inline');
};
