import React, { useContext, useEffect, useState } from 'react';

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
import { AuthContext } from '../auth/context/AuthModalContext';
import useSWR from 'swr';
import { Tag, getTags } from '@/backend/tags/getTags';
import { addTagToContentItem } from '@/backend/tags/addTagtoContentItem';
import {
	checkOverlap,
	extendHighlight,
} from '@/scripts/highlighter/utils/createHighlight/utils/overlapHighlights';
import { createNote } from '@/backend/notes/createNote';

const HighlighterApp: React.FC = () => {
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

							// Add notes and reactions to the highlight data
							acc[highlightData.uuid] = {
								...highlightData,
								notes: highlight.notes || [],
								reactions: highlight.reactions || [],
								user_meta: highlight.user_meta,
							};
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

	const authModalContext = useContext(AuthContext);

	/**
	 * Main function to handle processing of highlights with optional modifiers and callbacks.
	 * Checks for overlapping highlights, merges them if necessary, and then makes backend calls.
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

				// Check for overlapping highlights
				const overlappingHighlights = Object.values(highlights).filter(
					(existingHighlight) =>
						checkOverlap(existingHighlight, highlightData)
				);

				if (overlappingHighlights.length > 0) {
					// Merge all overlapping highlights with the new highlightData
					let mergedHighlight = { ...highlightData };
					const uuidsToDelete: string[] = [];

					overlappingHighlights.forEach((existingHighlight) => {
						mergedHighlight = extendHighlight(
							existingHighlight,
							mergedHighlight
						);
						uuidsToDelete.push(existingHighlight.uuid);
					});

					// Update state: Remove old highlights and add the merged highlight
					setHighlights((prevHighlights) => {
						const updatedHighlights = { ...prevHighlights };
						uuidsToDelete.forEach((uuid) => {
							delete updatedHighlights[uuid];
						});
						updatedHighlights[mergedHighlight.uuid] =
							mergedHighlight;
						return updatedHighlights;
					});

					// Perform additional actions if provided
					if (additionalActions) {
						additionalActions(mergedHighlight);
					}

					try {
						// Delete the overlapping highlights from the backend
						await Promise.all(
							uuidsToDelete.map(async (uuid) => {
								try {
									await deleteHighlight(uuid);
									toast({
										title: `Deleted overlapping highlight ${uuid}.`,
									});
								} catch (deleteError) {
									console.error(
										`Failed to delete highlight ${uuid}:`,
										deleteError
									);
									toast({
										title: `Error deleting highlight ${uuid}.`,
									});
								}
							})
						);

						// Save the merged highlight to the backend
						await saveHighlight(mergedHighlight);
						toast({
							title: 'Successfully updated and merged highlight.',
						});
					} catch (error) {
						toast({ title: 'Error updating highlight.' });
						// Revert state changes if saving fails
						setHighlights((prevHighlights) => {
							const revertedHighlights = { ...prevHighlights };
							uuidsToDelete.forEach((uuid) => {
								const originalHighlight =
									overlappingHighlights.find(
										(h) => h.uuid === uuid
									);
								if (originalHighlight) {
									revertedHighlights[uuid] =
										originalHighlight;
								}
							});
							delete revertedHighlights[highlightData.uuid];
							return revertedHighlights;
						});
					} finally {
						userSelection.empty();
					}
				} else {
					// No overlap detected; proceed as usual
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
						toast({ title: 'Error saving highlight.' });
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
		}
	};

	const handleHighlight = withAuth(() => {
		processHighlight();
	}, authModalContext);

	const handleAddNote = withAuth(() => {
		processHighlight((highlightData) => {
			setOpenNoteUuid(highlightData.uuid);
			createNote({
				noteValue: '',
				itemId: highlightData.uuid,
			});
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
						let selectedEmoji = null;
						try {
							selectedEmoji = JSON.parse(tag.icon).emoji;
						} catch {
							selectedEmoji = tag.icon;
						}
						toast({
							title: `Successfully saved highlight to ${selectedEmoji}${tag.name}`,
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

	useEffect(() => {
		const mergeConflictingHighlights = async () => {
			const highlightEntries = Object.values(highlights);
			if (highlightEntries.length < 2) return;

			// Sort highlights by start position
			const sortedHighlights = [...highlightEntries].sort(
				(a, b) =>
					a.matching.textPosition.start -
					b.matching.textPosition.start
			);

			const mergedHighlights: HighlightData[] = [];
			let current = sortedHighlights[0];
			const highlightsToDelete: string[] = [];

			for (let i = 1; i < sortedHighlights.length; i++) {
				const next = sortedHighlights[i];
				if (checkOverlap(current, next)) {
					const extended = extendHighlight(current, next);
					mergedHighlights.push(extended);
					highlightsToDelete.push(next.uuid);
					current = extended;
				} else {
					mergedHighlights.push(current);
					current = next;
				}
			}

			mergedHighlights.push(current); // Push the last one

			// Check if merging occurred
			const uniqueUUIDs = new Set(mergedHighlights.map((h) => h.uuid));
			if (uniqueUUIDs.size !== highlightEntries.length) {
				const mergedHighlightsMap: { [key: string]: HighlightData } =
					{};
				mergedHighlights.forEach((highlight) => {
					mergedHighlightsMap[highlight.uuid] = highlight;
				});

				setHighlights(mergedHighlightsMap);

				// Perform backend synchronization
				for (const uuid of highlightsToDelete) {
					try {
						await deleteHighlight(uuid);
						// toast({
						// 	title: `Deleted overlapping highlight ${uuid}.`,
						// });
					} catch (error) {
						console.error(
							`Failed to delete highlight ${uuid}:`,
							error
						);
						// toast({ title: `Error deleting highlight ${uuid}.` });
					}
				}

				for (const highlight of mergedHighlights) {
					try {
						await saveHighlight(highlight);
						// toast({
						// 	title: `Saved merged highlight ${highlight.uuid}.`,
						// });
					} catch (error) {
						// console.error(
						// 	`Failed to save merged highlight ${highlight.uuid}:`,
						// 	error
						// );
						toast({
							title: `Error saving highlight ${highlight.uuid}.`,
						});
					}
				}
			}
		};

		mergeConflictingHighlights();
	}, [highlights]);

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
