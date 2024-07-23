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

const HighlighterApp = () => {
	const initialHighlights: { [key: string]: HighlightData } = {};
	const [highlights, setHighlights] = useState<{
		[key: string]: HighlightData;
	}>(initialHighlights);

	const [highlightContainers, setHighlightContainers] = useState<{
		[key: string]: {
			range: Range;
			uuid: string;
			notesOpen?: boolean;
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

	const handleHighlight = (openNotes: boolean = false) => {
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
					containers?.forEach((range, index) => {
						newContainers[highlightData.uuid].push({
							range: range,
							uuid: highlightData.uuid,
							notesOpen:
								openNotes && index === containers.length - 1, // Open notes for the first container if openNotes is true
						});
					});
					return newContainers;
				});
			}
			window.getSelection()?.empty();
		}
	};

	const handleAddNote = () => {
		handleHighlight(true); // Pass true to open notes for the new highlight
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
					containers?.forEach((range) => {
						newContainers[highlightData.uuid].push({
							range: range,
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
		// for every container of this uuid, call unwrap on the container
		setHighlights((prevHighlights) => {
			const newHighlights = { ...prevHighlights };
			delete newHighlights[uuid];
			return newHighlights;
		});

		setHighlightContainers(() => {
			delete highlightContainers[uuid];
			return { ...highlightContainers };
		});

		// if (highlightContainers[uuid]) {
		// 	highlightContainers[uuid].forEach(({ highlightContainer }) => {
		// 		unwrap(highlightContainer);
		// 	});
		// }
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
				containers.reverse().map(({ range, uuid, notesOpen }) => {
					return (
						<Highlight
							rangeData={{
								startContainer: range.endContainer,
								startOffset: range.startOffset,
								endContainer: range.endContainer,
								endOffset: range.endOffset,
							}}
							range={range}
							highlightData={highlights[uuid]}
							setHighlightData={handleEditHighlight}
							onDelete={() => handleDeleteHighlight(uuid)}
							notesOpen={notesOpen || false}
						/>
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
