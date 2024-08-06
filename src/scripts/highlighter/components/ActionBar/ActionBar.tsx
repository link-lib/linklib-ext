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
			className='bb-bg-popover bb-text-slate-400 bb-ll-gap-3 bb-gap-2 bb-w-fit bb-absolute bb-justify-center bb-items-center bb-flex-row bb-rounded-md bb-border bb-p-2 bb-z-50 bb-text-sm'
			style={markerPosition}
		>
			<button
				className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'
				onClick={handleHighlight}
			>
				<Highlighter className='bb-w-full bb-h-full' />
			</button>
			<button
				className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'
				onClick={handleAddNote}
			>
				<PenBoxIcon className='bb-w-full bb-h-full' />
			</button>
			<RatingsBar onRate={handleRate} />
			<TagsAction />
			<button
				className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'
				onClick={handleAddNote}
			>
				<Brain className='bb-w-full bb-h-full' />
			</button>
			<button
				className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'
				onClick={handleClose}
			>
				<X className='bb-w-full bb-h-full' />
			</button>
		</div>
	);
};

export default ActionBar;
