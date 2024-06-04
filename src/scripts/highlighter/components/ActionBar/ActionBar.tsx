import { RatingsBar } from '@/scripts/highlighter/components/ActionBar/RatingsBar';
import { TagsAction } from '@/scripts/highlighter/components/ActionBar/TagsAction';
import { Brain, Highlighter, PenBoxIcon, X } from 'lucide-react';

const ActionBar = ({
	markerPosition,
	handleHighlight,
	handleAddNote,
	handleClose,
	handleRate,
}: {
	markerPosition: React.CSSProperties;
	handleHighlight: () => void;
	handleAddNote: () => void;
	handleClose: () => void;
	handleRate: (rating: number) => void;
}) => {
	return (
		<div
			className='bg-popover text-slate-400 ll-gap-3 gap-2 w-fit absolute justify-center items-center flex-row rounded-md border p-2 z-50 text-sm'
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
				onClick={handleAddNote}
			>
				<Brain className='w-full h-full' />
			</button>
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
