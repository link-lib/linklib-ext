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
import { createPortal } from 'react-dom';

const HighlighterApp = () => {
	const initialHighlights: { [key: string]: HighlightData } = {};
	const [highlights, setHighlights] = useState<{
		[key: string]: HighlightData;
	}>(initialHighlights);

	const [highlightContainers, setHighlightContainers] = useState<{
		[key: string]: {
			highlightContainer: HTMLElement;
			string: string;
			uuid: string;
		}[];
	}>({});

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
		setHighlights((prevHighlights) => ({
			...prevHighlights,
			[highlightData.uuid]: highlightData,
		}));
		// setHighlightContainers((prev) => {
		// 	const newMap = new Map(prev);
		// 	if (newMap.has(highlightData.uuid)) {
		// 		const container = newMap.get(highlightData.uuid);
		// 		if (container) {
		// 			newMap.set(highlightData.uuid, {
		// 				...container,
		// 				highlightData,
		// 			});
		// 		}
		// 	}
		// 	return newMap;
		// });
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
				const containers = createHighlightElement(highlightData);
				setHighlightContainers((prev) => {
					const newContainers = { ...prev };
					if (!newContainers[highlightData.uuid]) {
						newContainers[highlightData.uuid] = [];
					}
					containers?.forEach((container) => {
						newContainers[highlightData.uuid].push({
							...container,
							uuid: highlightData.uuid,
						});
					});
					return newContainers;
				});
			}
			window.getSelection()?.empty();
		}
	};

	const handleAddNote = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				setHighlights({
					...highlights,
					[highlightData.uuid]: highlightData,
				});
				const containers = createHighlightElement(highlightData);
				containers?.forEach(({ highlightContainer, string }) => {
					const root = createRoot(highlightContainer);
					root.render(
						<Highlight
							highlightElement={highlightContainer}
							highlightData={highlightData}
							setHighlightData={handleEditHighlight}
							notesOpen={true}
						>
							{string}
						</Highlight>
					);
				});
			}
			window.getSelection()?.empty();
		}
	};

	const handleClose = () => {
		// setMarkerPosition({ display: 'none' });
		window.getSelection()?.empty();
	};

	const handleRate = (rating: number) => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				setHighlights({
					...highlights,
					[highlightData.uuid]: { ...highlightData, rating },
				});
				const containers = createHighlightElement(highlightData);
				containers?.forEach(({ highlightContainer, string }) => {
					const root = createRoot(highlightContainer);
					root.render(
						<Highlight
							highlightElement={highlightContainer}
							highlightData={highlightData}
							setHighlightData={handleEditHighlight}
							initialRating={rating}
						>
							{string}
						</Highlight>
					);
				});
			}
			window.getSelection()?.empty();
		}
	};

	useEffect(() => {
		console.log(highlights);
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
		// 		return debug;
		// 	});
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
			{Object.values(highlightContainers).flatMap((containers) =>
				containers.map(({ highlightContainer, string, uuid }) =>
					createPortal(
						<Highlight
							highlightElement={highlightContainer}
							highlightData={highlights[uuid]}
							setHighlightData={handleEditHighlight}
						>
							{string}
						</Highlight>,
						highlightContainer
					)
				)
			)}
			{/* {Object.values(highlights).flatMap((highlightData) => {
				const containers = createHighlightElement(highlightData);

				debugger;
				containers?.forEach(({ highlightContainer, string }) => {
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
			})} */}
			<div className='md:sticky lg:block md:tw-left-auto md:tw-bottom-5 md:tw-right-5 md:tw-pl-4'></div>
		</>
	);
};

export default HighlighterApp;
