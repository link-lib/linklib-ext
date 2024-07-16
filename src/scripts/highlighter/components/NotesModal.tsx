import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/scripts/highlighter/components/Stars';
import { CirclePlus, Trash2, X } from 'lucide-react';

const NotesModal = ({
	note,
	setNote,
	onClose,
	highlightElement,
	rating,
	setRating,
}: {
	note: string;
	setNote: (note: string) => void;
	onClose: () => void;
	highlightElement: HTMLElement | null;
	rating: number;
	setRating: (rating: number) => void;
}) => {
	const handleDelete = () => {
		setNote('');
		if (highlightElement) {
			const unwrap = (element: HTMLElement) => {
				const parent = element.parentNode;
				while (element.firstChild) {
					if (element.firstChild instanceof HTMLElement) {
						unwrap(element.firstChild);
					} else {
						parent?.insertBefore(element.firstChild, element);
					}
				}
				parent?.removeChild(element);
			};
			unwrap(highlightElement);
		}
		onClose();
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
				placeholder='Write your note'
				value={note}
				onChange={(e) => setNote(e.target.value)}
				className='text-primary'
			/>
		</div>
	);
};

export default NotesModal;
