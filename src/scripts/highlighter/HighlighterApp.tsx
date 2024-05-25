import { useEffect, useState } from 'react';

import ActionBar from '@/scripts/highlighter/components/ActionBar/ActionBar';
import NotesModal from '@/scripts/highlighter/components/NotesModal';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import { createRoot } from 'react-dom/client';
// import ReactDOM from 'react-dom';

// Highlight.js
const Highlight = ({
	children,
	notesOpen = false,
}: {
	children: React.ReactNode;
	notesOpen?: boolean;
}) => {
	const [note, setNote] = useState<string>('');
	const [isPopoverOpen, setIsPopoverOpen] = useState<boolean>(notesOpen);

	return (
		<Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
			<PopoverTrigger asChild>
				<span
					className='linklib-ext bg-yellow-400 cursor-pointer'
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
		// const template = document.createElement('template');
		// template.id = 'highlightTemplate';
		// template.innerHTML = `
		// 	<span class="highlight" style="background-color: yellow; display: inline"></span>
		// `;
		// document.body.appendChild(template);

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
					<Highlight>{highlightContainer.innerHTML}</Highlight>
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
					<Highlight notesOpen={true}>
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
			/>
			<div className='fixed bottom-1 right-1 bg-green-500 p-2 rounded-full md:bg-green-600 lg:bg-green-700 md:block'>
				<svg
					xmlns='http://www.w3.org/2000/svg'
					className='h-6 w-6 text-white md:sticky'
					fill='none'
					viewBox='0 0 24 24'
					stroke='currentColor'
					strokeWidth={2}
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						d='M5 13l4 4L19 7'
					/>
				</svg>
			</div>
		</>
	);
};

export default HighlighterApp;
