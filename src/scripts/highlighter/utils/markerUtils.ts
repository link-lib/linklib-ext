export const getSelectedText = () => window.getSelection()?.toString() ?? '';

export const getMarkerPosition = () => {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return {}; // Early return if selection is null or no range is selected

	const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	const scrollLeft =
		window.pageXOffset || document.documentElement.scrollLeft;

	const rangeBounds = selection.getRangeAt(0).getBoundingClientRect();
	return {
		left: scrollLeft + rangeBounds.left + rangeBounds.width / 2 - 100,
		top: scrollTop + rangeBounds.top - 50,
		// top: rangeBounds.bottom + 10,
		display: 'flex',
	};
};

export type MarkerPosition = ReturnType<typeof getMarkerPosition>;
