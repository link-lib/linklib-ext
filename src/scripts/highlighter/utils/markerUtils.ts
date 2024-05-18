export const getSelectedText = () => window.getSelection()?.toString() ?? '';

export const getMarkerPosition = () => {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) {
		return { display: 'none' };
	}

	const range = selection.getRangeAt(0);
	const rect = range.getBoundingClientRect();
	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;

	return {
		top: rect.top + scrollTop,
		left: rect.left + scrollLeft,
		display: 'block',
	};
};

export type MarkerPosition = ReturnType<typeof getMarkerPosition>;
