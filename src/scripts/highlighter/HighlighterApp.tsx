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
				className='gap-2 w-fit absolute justify-center items-center flex flex-row bg-slate-800 rounded-md border border-slate-400 p-2 z-50 text-white'
				style={markerPosition}
			>
				<button className='hover:text-yellow-400 cursor-pointer w-3 h-3'>
					<Paintbrush className='w-3 h-3' />
				</button>
				<button className='hover:text-yellow-400 cursor-pointer w-3 h-3'>
					<NotebookPen className='w-3 h-3' />
				</button>
				<button className='hover:text-yellow-400 cursor-pointer w-3 h-3'>
					<Heart className='w-3 h-3' />
				</button>
				<button className='hover:text-yellow-400 cursor-pointer w-3 h-3'>
					😂
				</button>
				<button className='hover:text-yellow-400 cursor-pointer w-3 h-3'>
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
