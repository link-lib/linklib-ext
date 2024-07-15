import { useEffect, useState } from 'react';

import ActionBar from '@/scripts/highlighter/components/ActionBar/ActionBar';
import { Highlight } from '@/scripts/highlighter/components/Highlight';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { createHighlightElement } from '@/scripts/highlighter/utils/createHighlight';
import { extractHighlightData } from '@/scripts/highlighter/utils/highlightDataUtils';
import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import { createRoot } from 'react-dom/client';

const HighlighterApp = () => {
	const initialHighlights: { [key: string]: HighlightData } = {};
	const [highlights, setHighlights] = useState<{
		[key: string]: HighlightData;
	}>(initialHighlights);

	const [markerPosition, setMarkerPosition] = useState<
		MarkerPosition | { display: 'none' }
	>({ display: 'none' });

	useEffect(() => {
		document.addEventListener('click', () => {
			if (getSelectedText().length > 0) {
				setMarkerPosition(getMarkerPosition());
			}
		});

		document.addEventListener('selectionchange', () => {
			if (getSelectedText().length === 0) {
				setMarkerPosition({ display: 'none' });
			}
		});

		return () => {
			document.removeEventListener('click', () => {
				if (getSelectedText().length > 0) {
					setMarkerPosition(getMarkerPosition());
				}
			});

			document.removeEventListener('selectionchange', () => {
				if (getSelectedText().length === 0) {
					setMarkerPosition({ display: 'none' });
				}
			});
		};
	}, []);

	const handleEditHighlight = (highlightData: HighlightData) => {
		debugger;
		setHighlights({
			...highlights,
			[highlightData.uuid]: highlightData,
		});
	};

	const handleHighlight = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				setHighlights({
					...highlights,
					[highlightData.uuid]: highlightData,
				});
				// const containers = createHighlightElement(highlightData);
				// containers?.forEach(({ highlightContainer, string }) => {
				// 	const root = createRoot(highlightContainer);
				// 	root.render(
				// 		<Highlight
				// 			highlightElement={highlightContainer}
				// 			highlightId={highlightData.uuid}
				// 			highlightData={highlightData}
				// 			setHighlightData={handleEditHighlight}
				// 		>
				// 			{string}
				// 		</Highlight>
				// 	);
				// });
			}
			window.getSelection()?.empty();
		}
	};

	const handleAddNote = () => {
		// const userSelection = window.getSelection();
		// if (userSelection) {
		// 	for (let i = 0; i < userSelection.rangeCount; i++) {
		// 		const range = userSelection.getRangeAt(i);
		// 		const highlightContainer = document.createElement('span');
		// 		range.surroundContents(highlightContainer);
		// 		const root = createRoot(highlightContainer);
		// 		root.render(
		// 			<Highlight
		// 				highlightElement={highlightContainer}
		// 				notesOpen={true}
		// 			>
		// 				{highlightContainer.innerHTML}
		// 			</Highlight>
		// 		);
		// 	}
		// 	window.getSelection()?.empty();
		// }
	};

	const handleClose = () => {
		// setMarkerPosition({ display: 'none' });
		window.getSelection()?.empty();
	};

	const handleRate = (rating: number) => {
		console.log(rating);
		// const userSelection = window.getSelection();
		// if (userSelection) {
		// 	for (let i = 0; i < userSelection.rangeCount; i++) {
		// 		const range = userSelection.getRangeAt(i);
		// 		const highlightContainer = document.createElement('span');
		// 		range.surroundContents(highlightContainer);
		// 		const root = createRoot(highlightContainer);
		// 		root.render(
		// 			<Highlight
		// 				highlightElement={highlightContainer}
		// 				initialRating={rating}
		// 			>
		// 				{highlightContainer.innerHTML}
		// 			</Highlight>
		// 		);
		// 	}
		// 	window.getSelection()?.empty();
		// }
	};

	useEffect(() => {
		console.log(highlights);
		debugger;
		// 	const huh = Object.values(highlights).flatMap((highlightData) => {
		// 		const containers = createHighlightElement(highlightData);

		// 		const debug = containers.map(({ highlightContainer, string }) =>
		// 			createPortal(
		// 				<Highlight
		// 					highlightElement={highlightContainer}
		// 					highlightId={highlightData.uuid}
		// 				>
		// 					{string}
		// 				</Highlight>,
		// 				highlightContainer
		// 			)
		// 		);
		// 		debugger;
		// 		return debug;
		// 	});
		// 	debugger;
		// 	console.log(huh);
	}, [highlights]);

	return (
		<>
			<ActionBar
				markerPosition={markerPosition}
				handleHighlight={handleHighlight}
				handleAddNote={handleAddNote}
				handleClose={handleClose}
				handleRate={handleRate}
			/>
			{Object.values(highlights).flatMap((highlightData) => {
				const containers = createHighlightElement(highlightData);

				debugger;
				containers?.forEach(({ highlightContainer, string }) => {
					debugger;
					const root = createRoot(highlightContainer);
					root.render(
						<Highlight
							highlightElement={highlightContainer}
							highlightId={highlightData.uuid}
							highlightData={highlightData}
							setHighlightData={handleEditHighlight}
						>
							{string}
						</Highlight>
					);
				});
				// const portals = containers?.map(
				// 	({ highlightContainer, string }) =>
				// createPortal(
				// 	<Highlight
				// 		highlightElement={highlightContainer}
				// 		highlightId={highlightData.uuid}
				// 	>
				// 		{string}
				// 	</Highlight>,
				// 	highlightContainer
				// )
				// );
				// return portals;
			})}
			<div className='md:sticky lg:block md:tw-left-auto md:tw-bottom-5 md:tw-right-5 md:tw-pl-4'></div>
		</>
	);
};

export default HighlighterApp;
