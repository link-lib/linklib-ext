import { useContext, useEffect, useState } from 'react';

import { withAuth } from '@/backend/auth/withAuth';
import { deleteHighlight } from '@/backend/deleteHighlight';
import { getHighlights } from '@/backend/getHighlights';
import { saveHighlight } from '@/backend/saveHighlight';
import { toast } from '@/components/ui/use-toast';
import ActionBar from '@/scripts/highlighter/components/ActionBar/ActionBar';
import { Highlight } from '@/scripts/highlighter/components/Highlight';
import { HighlightData } from '@/scripts/highlighter/types/HighlightData';
import { extractHighlightData } from '@/scripts/highlighter/utils/highlightDataUtils';
import HighlightSidebar from '@/scripts/sidebar/HighlightSidebar';
import { AuthModalContext } from '../auth/context/AuthModalContext';
import useSWR from 'swr';
import { Tag, getTags } from '@/backend/tags/getTags';
import { addTagToContentItem } from '@/backend/tags/addTagtoContentItem';

const HighlighterApp = () => {
	const [highlights, setHighlights] = useState<{
		[key: string]: HighlightData;
	}>({});

	const [openNoteUuid, setOpenNoteUuid] = useState<string | null>(null);

	const [isLoading, setIsLoading] = useState(true);

	useSWR<Tag[]>('getTags', getTags, {
		revalidateOnFocus: false,
		revalidateOnReconnect: false,
		revalidateIfStale: false,
	});

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

	const handleEditHighlight = (highlightData: HighlightData) => {
		setHighlights((prevHighlights) => ({
			...prevHighlights,
			[highlightData.uuid]: highlightData,
		}));
	};

	const authModalContext = useContext(AuthModalContext);

	/**
	 * Main function to handle processing of highlights with optional modifiers and callbacks.
	 * @param modifier Optional function to modify highlightData before saving.
	 * @param additionalActions Optional function to perform additional actions after setting highlightData.
	 */
	const processHighlight = async (
		modifier?: (highlightData: HighlightData) => void,
		additionalActions?: (highlightData: HighlightData) => void
	) => {
		const userSelection = window.getSelection();
		const selectionString = userSelection?.toString().trim();

		if (!selectionString) {
			userSelection?.empty();
			return;
		}

		if (userSelection) {
			const highlightData = extractHighlightData(userSelection);
			if (highlightData) {
				// Apply modifier if provided
				if (modifier) {
					modifier(highlightData);
				}

				setHighlights((prevHighlights) => ({
					...prevHighlights,
					[highlightData.uuid]: highlightData,
				}));

				// Perform additional actions if provided
				if (additionalActions) {
					additionalActions(highlightData);
				}

				try {
					await saveHighlight(highlightData);
					toast({ title: 'Successfully saved highlight.' });
				} catch (error) {
					toast({ title: 'Error saving highlight' });
					setHighlights((prevHighlights) => {
						const newHighlights = { ...prevHighlights };
						delete newHighlights[highlightData.uuid];
						return newHighlights;
					});
				} finally {
					userSelection.empty();
				}
			}
		}
	};

	const handleHighlight = withAuth(() => {
		processHighlight();
	}, authModalContext);

	const handleAddNote = withAuth(() => {
		processHighlight((highlightData) => {
			setOpenNoteUuid(highlightData.uuid);
		});
	}, authModalContext);

	const handleRate = withAuth((rating: number) => {
		processHighlight((highlightData) => {
			highlightData.rating = rating;
		}, undefined);
	}, authModalContext);

	const handleHighlightAndTag = withAuth((tag: Tag) => {
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
						// After successfully saving the highlight, add the tag
						return addTagToContentItem({
							itemId: highlightData.uuid,
							tagId: tag.id,
						});
					})
					.then(() => {
						const tagIcon = tag.icon ? `${tag.icon} ` : '';
						toast({
							title: `Successfully saved highlight to ${tagIcon}${tag.name}`,
						});
					})
					.catch((error) => {
						console.error(
							'Error saving highlight or adding tag:',
							error
						);
						toast({ title: 'Error saving highlight with tag' });
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
				handleHighlight={handleHighlight}
				handleAddNote={handleAddNote}
				handleClose={handleClose}
				handleRate={handleRate}
				handleHighlightAndTag={handleHighlightAndTag}
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
