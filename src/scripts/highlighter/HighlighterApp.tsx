import { useEffect, useState } from 'react';

import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Heart, NotebookPen, Paintbrush } from 'lucide-react';

// Highlight.js
const Highlight = ({ children }: any) => (
	<span style={{ backgroundColor: 'yellow', color: 'black' }}>
		{children}
	</span>
);

const HighlighterApp = () => {
	const [markerPosition, setMarkerPosition] = useState<
		MarkerPosition | { display: 'none' }
	>({ display: 'none' });

	useEffect(() => {
		console.log('useEffect');

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

	return (
		<>
			<div
				className='text-slate-400 ll-gap-3 gap-2 w-fit absolute justify-center items-center flex-row bg-slate-800 rounded-md border p-2 z-50 text-sm'
				style={markerPosition}
				onClick={() => {
					const userSelection = window.getSelection();
					if (userSelection) {
						for (let i = 0; i < userSelection.rangeCount; i++) {
							const clone =
								this.highlightTemplate.cloneNode(true).content
									.firstElementChild;
							clone.appendChild(range.extractContents());
							range.insertNode(clone);
						}
						window.getSelection().empty();
					}
				}}
			>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<Paintbrush className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<NotebookPen className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<Heart className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					😂
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					🥲
				</button>
			</div>
			<div className='App'>
				<header className='App-header bg-popover-red md:sticky top-0'>
					<p className='text-blue-500'>shmm</p>
					<Popover>
						<PopoverTrigger>Open</PopoverTrigger>
						<PopoverContent>
							Place content for the popover here.
						</PopoverContent>
					</Popover>
				</header>
			</div>
		</>
	);
};

export default HighlighterApp;
