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
				className='text-slate-400 gap-2 w-fit absolute justify-center items-center flex flex-row bg-slate-800 rounded-md border p-2 z-50 text-sm'
				style={markerPosition}
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
				<header className='App-header bg-red-500'>
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
