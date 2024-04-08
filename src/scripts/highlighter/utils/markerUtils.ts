export const getSelectedText = () => window.getSelection()?.toString() ?? '';

export const getMarkerPosition = () => {
	const selection = window.getSelection();
	if (!selection || selection.rangeCount === 0) return {}; // Early return if selection is null or no range is selected

	const rangeBounds = selection.getRangeAt(0).getBoundingClientRect();
	return {
		left: rangeBounds.left + rangeBounds.width / 2 - 20,
		top: rangeBounds.top - 30,
		display: 'flex',
	};
};

export type MarkerPosition = ReturnType<typeof getMarkerPosition>;
