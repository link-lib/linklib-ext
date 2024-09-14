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
			inputRef.current.setSelectionRange(note.length, note.length);
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
			<div className='flex gap-2 justify-between items-center flex-row rounded-md p-2 text-sm'>
				<div>
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						<CirclePlus className='w-full h-full' />
					</button>
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						😂
					</button>
					<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
						🥲
					</button>
				</div>
				<div className='flex flex-row items-center'>
					<StarRating onRating={setRating} initialRating={rating} />
					<button
						className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
						onClick={handleDelete}
					>
						<Trash2 className='w-full h-full' />
					</button>
					<button
						className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'
						onClick={onClose}
					>
						<X className='w-full h-full' />
					</button>
				</div>
			</div>
			<Textarea
				ref={inputRef}
				className='text-primary'
				placeholder='Write your note'
				value={note}
				onChange={(e) => setNote(e.target.value)}
			/>
		</div>
	);
};

export default NotesModal;
