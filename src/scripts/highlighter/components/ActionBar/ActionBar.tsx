import { RatingsBar } from '@/scripts/highlighter/components/ActionBar/RatingsBar';
import { TagsAction } from '@/scripts/highlighter/components/ActionBar/TagsAction';
import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import { Highlighter, PenBoxIcon, X } from 'lucide-react';
import { useEffect, useState } from 'react';

const ActionBar = ({
	handleHighlight,
	handleAddNote,
	handleClose,
	handleRate,
}: {
	handleHighlight: () => void;
	handleAddNote: () => void;
	handleClose: () => void;
	handleRate: (rating: number) => void;
}) => {
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

	return (
		<div
			className='fixed bg-popover text-slate-400 ll-gap-3 gap-2 w-fit justify-center items-center flex-row rounded-md border p-2 text-sm z-infinite'
			style={markerPosition}
		>
			<button
				className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
				onClick={handleHighlight}
			>
				<Highlighter className='w-full h-full' />
			</button>
			<button
				className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
				onClick={handleAddNote}
			>
				<PenBoxIcon className='w-full h-full' />
			</button>
			<RatingsBar onRate={handleRate} />
			<TagsAction />
			<button
				className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
				onClick={handleClose}
			>
				<X className='w-full h-full' />
			</button>
		</div>
	);
};

export default ActionBar;
