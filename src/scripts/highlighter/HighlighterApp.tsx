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
		handleHighlight();
	};

	const handleClose = () => {
		window.getSelection()?.empty();
	};

	const handleRate = (rating: number) => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				setHighlights((prevHighlights) => ({
					...prevHighlights,
					[highlightData.uuid]: { ...highlightData, rating },
				}));
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

	const handleDeleteHighlight = (uuid: string) => {
		const unwrap = (element: HTMLElement) => {
			const parent = element.parentNode;
			while (element.firstChild) {
				if (element.firstChild instanceof HTMLElement) {
					unwrap(element.firstChild);
				} else {
					parent?.insertBefore(element.firstChild, element);
				}
			}
			parent?.removeChild(element);
		};

		// for every container of this uuid, call unwrap on the container
		setHighlights((prevHighlights) => {
			const newHighlights = { ...prevHighlights };
			delete newHighlights[uuid];
			return newHighlights;
		});

		debugger;

		setHighlightContainers(() => {
			delete highlightContainers[uuid];
			return { ...highlightContainers };
		});

		if (highlightContainers[uuid]) {
			highlightContainers[uuid].forEach(({ highlightContainer }) => {
				unwrap(highlightContainer);
			});
		}
	};

	useEffect(() => {
		console.log(highlights);
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
				containers.map(({ highlightContainer, string, uuid }) => {
					console.log(string);
					console.log(highlights[uuid].matching.body);
					debugger;
					return createPortal(
						<Highlight
							highlightElement={highlightContainer}
							highlightData={highlights[uuid]}
							setHighlightData={handleEditHighlight}
							onDelete={() => handleDeleteHighlight(uuid)} // Pass the handleDeleteHighlight function
						>
							{string}
						</Highlight>,
						highlightContainer
					);
				})
			)}
			{/* {Object.entries(highlightContainers).map(([uuid, containers]) => {
				const firstContainer = containers[0];
				const highlightElement = firstContainer.highlightContainer;
				const rect = highlightElement.getBoundingClientRect();
				const top = rect.top + window.scrollY;

				if (!highlights[uuid].note) return null;

				return (
					<Comment
						key={uuid}
						uuid={uuid}
						note={highlights[uuid].note}
						top={top}
					/>
				);
			})} */}
			<div className='md:sticky lg:block md:tw-left-auto md:tw-bottom-5 md:tw-right-5 md:tw-pl-4'></div>
		</>
	);
};

export default HighlighterApp;
