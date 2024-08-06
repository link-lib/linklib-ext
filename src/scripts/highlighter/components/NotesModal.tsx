import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/scripts/highlighter/components/Stars';
import { CirclePlus, Trash2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

const NotesModal = ({
	note,
	setNote,
	onClose,
	rating,
	setRating,
	onDelete,
	shouldFocusInput,
	onInputFocused,
}: {
	note: string;
	setNote: (note: string) => void;
	onClose: () => void;
	rating: number;
	setRating: (rating: number) => void;
	onDelete: () => void;
	shouldFocusInput: boolean;
	onInputFocused: () => void;
}) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (shouldFocusInput && inputRef.current) {
			inputRef.current.focus();
			onInputFocused();
		}
	}, [shouldFocusInput, onInputFocused]);

	const handleDelete = () => {
		setNote('');
		onClose();
		onDelete();
	};

	return (
		<div>
			<div className='bb-flex bb-gap-2 bb-justify-between bb-items-center bb-flex-row bb-rounded-md bb-p-2 bb-text-sm'>
				<div>
					<button className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'>
						<CirclePlus className='bb-w-full bb-h-full' />
					</button>
					<button className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'>
						😂
					</button>
					<button className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'>
						🥲
					</button>
				</div>
				<div className='bb-flex bb-flex-row bb-items-center'>
					<StarRating onRating={setRating} initialRating={rating} />
					<button
						className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'
						onClick={handleDelete}
					>
						<Trash2 className='bb-w-full bb-h-full' />
					</button>
					<button
						className='bb-hover:text-white bb-hover:border-white bb-border bb-border-transparent bb-cursor-pointer bb-w-6 bb-h-6 bb-rounded-lg bb-p-1 bb-transition-colors bb-duration-150'
						onClick={onClose}
					>
						<X className='bb-w-full bb-h-full' />
					</button>
				</div>
			</div>
			<Textarea
				ref={inputRef}
				className='bb-text-primary'
				placeholder='Write your note'
				value={note}
				onChange={(e) => setNote(e.target.value)}
			/>
		</div>
	);
};

export default NotesModal;
