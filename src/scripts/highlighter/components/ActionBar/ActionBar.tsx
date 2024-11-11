import { Tag } from '@/backend/tags/getTags';
// import { RatingsBar } from '@/scripts/highlighter/components/ActionBar/RatingsBar';
// import { TagsAction } from '@/scripts/highlighter/components/ActionBar/TagsAction';
import {
	MarkerPosition,
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import { Highlighter, PenBoxIcon, SmilePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { EmojiPicker } from '../Reactions/EmojiPicker';
// import { useSWRConfig } from 'swr';

const QUICK_REACTIONS = [
	{ emoji: '❤️', label: 'heart' },
	{ emoji: '🔥', label: 'fire' },
	{ emoji: '🤯', label: 'mind blown' },
] as const;

type ActionBarProps = {
	handleHighlight: () => void;
	handleAddNote: () => void;
	handleClose: () => void;
	handleRate: (rating: number) => void;
	handleHighlightAndTag: (tag: Tag) => void;
	onAddReaction: (emoji: string) => Promise<void>;
};

export const ActionBar = ({
	handleHighlight,
	handleAddNote,
	// handleClose,
	// handleRate,
	// handleHighlightAndTag,
	onAddReaction,
}: ActionBarProps) => {
	const [markerPosition, setMarkerPosition] = useState<
		MarkerPosition | { display: 'none' }
	>({ display: 'none' });

	// const { cache } = useSWRConfig();
	// const { data: tags = [] } = (cache.get('getTags') || {}) as {
	// 	data?: Tag[];
	// };

	// const watchLaterTag = tags.find(
	// 	(tag) => tag.name.toLowerCase() === 'watch later'
	// );

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

	if (!markerPosition || !getSelectedText()) {
		return null;
	}

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
			{/* <RatingsBar onRate={handleRate} /> */}
			{/* <TagsAction onTagSelect={handleHighlightAndTag} /> */}
			{/* {watchLaterTag && (
				<button
					className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
					onClick={() => handleHighlightAndTag(watchLaterTag)}
				>
					<Clock className='w-full h-full' />
				</button>
			)} */}

			<div className='flex gap-1'>
				{/* Quick Reaction Buttons */}
				<div className='flex items-center gap-1 '>
					{QUICK_REACTIONS.map(({ emoji, label }) => (
						<button
							key={label}
							onClick={() => onAddReaction(emoji)}
							className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150 flex items-center justify-center'
							aria-label={`React with ${label}`}
						>
							<span className='text-sm'>{emoji}</span>
						</button>
					))}

					<EmojiPicker
						onEmojiSelect={onAddReaction}
						side='bottom'
						align='center'
						trigger={
							<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
								<SmilePlus className='w-full h-full' />
							</button>
						}
					/>
				</div>

				{/* Other Actions */}
				<div className='flex items-center gap-1'>
					{/* ... other action buttons ... */}
				</div>
			</div>

			{/* <button
				className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
				onClick={handleClose}
			>
				<X className='w-full h-full' />
			</button> */}
		</div>
	);
};

export default ActionBar;
