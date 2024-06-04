import { useEffect, useState } from 'react';

import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import ActionBar from '@/scripts/highlighter/components/ActionBar/ActionBar';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';

const Highlight = ({
	children,
	notesOpen = false,
	highlightElement,
	initialRating = 0,
}: {
	children: React.ReactNode;
	notesOpen?: boolean;
	highlightElement: HTMLElement | null;
	initialRating?: number;
}) => {
	const [note, setNote] = useState<string>('');
	const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(notesOpen);
	const [rating, setRating] = useState<number>(initialRating);

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
			<PopoverTrigger asChild>
				<span
					className='bg-green-400 cursor-pointer hover:bg-yellow-300'
					style={{}}
					onClick={(e) => {
						e.preventDefault();
						e.stopPropagation();
						setIsPopoverOpen(true);
					}}
				>
					{children}
				</span>
			</PopoverTrigger>
			<PopoverContent className='w-[550px]'>
				<NotesModal
					note={note}
					setNote={setNote}
					onClose={() => setIsPopoverOpen(false)}
					highlightElement={highlightElement}
					rating={rating}
					setRating={setRating}
				/>
			</PopoverContent>
		</Popover>
	);
};

const HighlighterApp = () => {
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

	const handleHighlight = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			for (let i = 0; i < userSelection.rangeCount; i++) {
				const range = userSelection.getRangeAt(i);
				const highlightContainer = document.createElement('span');
				range.surroundContents(highlightContainer);
				const root = createRoot(highlightContainer);
				root.render(
					<Highlight highlightElement={highlightContainer}>
						{highlightContainer.innerHTML}
					</Highlight>
				);
			}
			window.getSelection()?.empty();
		}
	};

	const handleAddNote = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			for (let i = 0; i < userSelection.rangeCount; i++) {
				const range = userSelection.getRangeAt(i);
				const highlightContainer = document.createElement('span');
				range.surroundContents(highlightContainer);
				const root = createRoot(highlightContainer);
				root.render(
					<Highlight
						highlightElement={highlightContainer}
						notesOpen={true}
					>
						{highlightContainer.innerHTML}
					</Highlight>
				);
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
			for (let i = 0; i < userSelection.rangeCount; i++) {
				const range = userSelection.getRangeAt(i);
				const highlightContainer = document.createElement('span');
				range.surroundContents(highlightContainer);
				const root = createRoot(highlightContainer);
				root.render(
					<Highlight
						highlightElement={highlightContainer}
						initialRating={rating}
					>
						{highlightContainer.innerHTML}
					</Highlight>
				);
			}
			window.getSelection()?.empty();
		}
	};

	return (
		<>
			<ActionBar
				markerPosition={markerPosition}
				handleHighlight={handleHighlight}
				handleAddNote={handleAddNote}
				handleClose={handleClose}
				handleRate={handleRate}
			/>
			<div className='md:sticky lg:block'></div>
		</>
	);
};

export default HighlighterApp;
