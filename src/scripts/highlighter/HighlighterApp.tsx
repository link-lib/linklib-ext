import { useContext, useEffect, useState } from 'react';

import ActionBar from '@/scripts/highlighter/components/ActionBar/ActionBar';
import { Highlight } from '@/scripts/highlighter/components/Highlight';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { extractHighlightData } from '@/scripts/highlighter/utils/highlightDataUtils';
import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import { saveHighlight } from '@/backend/saveHighlight';
import { toast } from '@/components/ui/use-toast';
import HighlightSidebar from '@/scripts/sidebar/HighlightSidebar';
import { AuthModalContext } from '../auth/context/AuthModalContext';
import { withAuth } from '@/backend/auth/withAuth';
import { deleteHighlight } from '@/backend/deleteHighlight';
import { getHighlights } from '@/backend/getHighlights';

const HighlighterApp = () => {
	const [highlights, setHighlights] = useState<{
		[key: string]: HighlightData;
	}>({});

	const [openNoteUuid, setOpenNoteUuid] = useState<string | null>(null);

	const [markerPosition, setMarkerPosition] = useState<
		MarkerPosition | { display: 'none' }
	>({ display: 'none' });

	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchHighlights = async () => {
			try {
				const pageUrl = window.location.href;

				const fetchedHighlights = await getHighlights(pageUrl);

				const highlightsObject = fetchedHighlights.reduce(
					(acc, highlight) => {
						if (highlight.highlight_data) {
							const highlightData = JSON.parse(
								// @ts-expect-error highlight_data is a string
								highlight.highlight_data
							) as HighlightData;
							acc[highlightData.uuid] = highlightData;
						}
						return acc;
					},
					{} as { [key: string]: HighlightData }
				);

				setHighlights(highlightsObject);
			} catch (error) {
				console.error('Failed to fetch highlights:', error);
				// Optionally, you can set an error state here to show an error message to the user
			} finally {
				setIsLoading(false);
			}
		};

		fetchHighlights();
	}, []);

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
	};

	const authModalContext = useContext(AuthModalContext);

	const handleHighlight = withAuth(() => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				setHighlights({
					...highlights,
					[highlightData.uuid]: highlightData,
				});
				saveHighlight(highlightData)
					.then(() => {
						toast({ title: 'Successfully saved highlight.' });
					})
					.catch(() => {
						toast({ title: 'Error saving highlight' });
						setHighlights((prevHighlights) => {
							const newHighlights = { ...prevHighlights };
							delete newHighlights[highlightData.uuid];
							return newHighlights;
						});
					});
			}
			window.getSelection()?.empty();
		}
	}, authModalContext);

	const handleAddNote = withAuth(() => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				setHighlights({
					...highlights,
					[highlightData.uuid]: highlightData,
				});
				setOpenNoteUuid(highlightData.uuid);
				saveHighlight(highlightData)
					.then(() => {
						toast({ title: 'Successfully saved highlight.' });
					})
					.catch(() => {
						toast({ title: 'Error saving highlight' });
						setHighlights((prevHighlights) => {
							const newHighlights = { ...prevHighlights };
							delete newHighlights[highlightData.uuid];
							return newHighlights;
						});
					});
			}
			window.getSelection()?.empty();
		}
	}, authModalContext);

	const handleRate = withAuth((rating: number) => {
		const userSelection = window.getSelection();
		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				highlightData.rating = rating;
				setHighlights({
					...highlights,
					[highlightData.uuid]: highlightData,
				});
				saveHighlight(highlightData)
					.then(() => {
						toast({ title: 'Successfully saved highlight.' });
					})
					.catch(() => {
						toast({ title: 'Error saving highlight' });
						setHighlights((prevHighlights) => {
							const newHighlights = { ...prevHighlights };
							delete newHighlights[highlightData.uuid];
							return newHighlights;
						});
					});
			}
			window.getSelection()?.empty();
		}
	}, authModalContext);

	const handleDeleteHighlight = withAuth((uuid: string) => {
		const highlight = highlights[uuid];
		setHighlights((prevHighlights) => {
			const newHighlights = { ...prevHighlights };
			delete newHighlights[uuid];
			return newHighlights;
		});

		deleteHighlight(uuid)
			.then(() => {
				toast({ title: 'Successfully deleted highlight.' });
			})
			.catch(() => {
				toast({ title: 'Error deleting highlight' });
				setHighlights((prevHighlights) => ({
					...prevHighlights,
					[uuid]: highlight,
				}));
			});
	}, authModalContext);

	const handleClose = () => {
		window.getSelection()?.empty();
	};

	if (isLoading) {
		return <div>Loading highlights...</div>; // Or any loading indicator you prefer
	}

	return (
		<>
			<ActionBar
				markerPosition={markerPosition}
				handleHighlight={handleHighlight}
				handleAddNote={handleAddNote}
				handleClose={handleClose}
				handleRate={handleRate}
			/>
			{Object.entries(highlights).map(([uuid, highlightData]) => (
				<Highlight
					key={uuid}
					highlightData={highlightData}
					setHighlightData={handleEditHighlight}
					onDelete={() => handleDeleteHighlight(uuid)}
					notesOpen={openNoteUuid === uuid}
				/>
			))}
			<HighlightSidebar highlights={highlights} />
		</>
	);
};

export default HighlighterApp;
