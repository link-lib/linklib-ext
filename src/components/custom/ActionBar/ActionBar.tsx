import { TagsAction } from '@/components/custom/ActionBar/TagsAction';
import { NotebookPen, Paintbrush, Star, X } from 'lucide-react';

const ActionBar = ({
	markerPosition,
	handleHighlight,
	handleAddNote,
}: {
	markerPosition: React.CSSProperties;
	handleHighlight: () => void;
	handleAddNote: () => void;
}) => {
	return (
		<div
			className='bg-slate-800 text-slate-400 ll-gap-3 gap-2 w-fit absolute justify-center items-center flex-row rounded-md border p-2 z-50 text-sm'
			style={markerPosition}
		>
			<button
				className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
				onClick={handleHighlight}
			>
				<Paintbrush className='w-full h-full' />
			</button>
			<button
				className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
				onClick={handleAddNote}
			>
				<NotebookPen className='w-full h-full' />
			</button>
			<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
				<Star className='w-full h-full' />
			</button>
			<TagsAction />
			<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
				<X className='w-full h-full' />
			</button>
		</div>
	);
};

export default ActionBar;
