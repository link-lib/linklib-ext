import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/scripts/highlighter/components/Stars';
import { Note } from '@/utils/supabase/typeAliases';
import { CirclePlus, Trash2, X } from 'lucide-react';
import { useEffect, useRef } from 'react';

type NotesModalProps = {
	notes: Note[];
	setNotes: (notes: Note[]) => void;
	onNoteChange: (noteId: number, value: string) => void;
	onClose: () => void;
	rating: number;
	setRating: (rating: number) => void;
	onDelete: () => void;
	shouldFocusInput: boolean;
	onInputFocused: () => void;
};

const NotesModal = ({
	notes,
	onNoteChange,
	onClose,
	rating,
	setRating,
	onDelete,
	shouldFocusInput,
	onInputFocused,
}: NotesModalProps) => {
	const inputRef = useRef<HTMLTextAreaElement>(null);

	useEffect(() => {
		if (shouldFocusInput && inputRef.current) {
			inputRef.current.focus();
			inputRef.current.setSelectionRange(
				notes[0].value.length,
				notes[0].value.length
			);
			onInputFocused();
		}
	}, [shouldFocusInput, onInputFocused, notes]);

	const handleDelete = () => {
		// setNote('');
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
				value={notes.length > 0 ? notes[0].value : ''}
				onChange={(e) => onNoteChange(notes[0].id, e.target.value)}
			/>
		</div>
	);
};

export default NotesModal;
