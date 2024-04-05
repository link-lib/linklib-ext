import React, { useEffect, useRef } from 'react';

const highlightColor = 'rgb(255, 214, 0, 0.4)';
const highlightUnderlineColour = '#FF9900';

const template = `
  <template id="highlightTemplate">
    <span class="highlight" style="background-color: ${highlightColor}; display: inline"></span>
  </template>

  <button id="mediumHighlighter">
    <svg class="text-marker" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 512">...</svg>
  </button>
`;

const styled = ({
	display = 'none',
	left = 0,
	top = 0,
}: {
	display?: string;
	left?: number;
	top?: number;
}) => `
  #mediumHighlighter {
    ...
    display: ${display};
    left: ${left}px;
    top: ${top}px;
    ...
  }
  .text-marker:hover {
    fill: ${highlightColor};
  }
`;

interface MarkerPosition {
	display?: string;
	left?: number;
	top?: number;
}

interface MediumHighlighterProps {
	markerPosition?: MarkerPosition;
}

const MediumHighlighter: React.FC<MediumHighlighterProps> = ({
	markerPosition = {},
}) => {
	const highlighterRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!highlighterRef.current) return;

		const shadowRoot = highlighterRef.current.attachShadow({
			mode: 'open',
		});
		const style = document.createElement('style');
		style.textContent = styled(markerPosition);
		shadowRoot.appendChild(style);
		shadowRoot.innerHTML += template;
		const button = shadowRoot.getElementById('mediumHighlighter');
		if (button) {
			button.addEventListener('click', highlightSelection);
		}

		return () => {
			if (button) {
				button.removeEventListener('click', highlightSelection);
			}
		};
	}, [markerPosition]);

	const highlightSelection = () => {
		const userSelection = window.getSelection();
		if (!userSelection) return;
		for (let i = 0; i < userSelection.rangeCount; i++) {
			highlightRange(userSelection.getRangeAt(i));
		}
		userSelection.empty();
	};

	const highlightRange = (range: Range) => {
		const shadowRoot = highlighterRef.current?.shadowRoot;
		if (!shadowRoot) return;
		const clone = shadowRoot
			.getElementById('highlightTemplate')
			?.cloneNode(true) as HTMLTemplateElement; // Change to HTMLTemplateElement
		if (!clone) return;
		const content = clone.content; // Now you can safely access .content
		const span = content.firstElementChild?.cloneNode(true) as HTMLElement;
		if (!span) return;
		span.appendChild(range.extractContents());
		range.insertNode(span);
	};

	return (
		<div ref={highlighterRef} onClick={() => console.log('click')}>
			asdasd
		</div>
	);
};

export default MediumHighlighter;
