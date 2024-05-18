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
import ReactDOM from 'react-dom';
// import ReactDOM from 'react-dom';

// Highlight.js
const Highlight = ({ children }: { children: React.ReactNode }) => {
	
	return (
		<span
			className='linklib-ext bg-yellow-400'
			style={{}}
			onClick={(e) => {
				e.preventDefault();
				e.stopPropagation();
			}}
		>
			{children}
		</span>
	);
};

const HighlighterApp = () => {
	const [markerPosition, setMarkerPosition] = useState<
		MarkerPosition | { display: 'none' }
	>({ display: 'none' });

	useEffect(() => {
		// const template = document.createElement('template');
		// template.id = 'highlightTemplate';
		// template.innerHTML = `
		// 	<span class="highlight" style="background-color: yellow; display: inline"></span>
		// `;
		// document.body.appendChild(template);

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

	const handleHighlight = () => {
		const userSelection = window.getSelection();
		if (userSelection) {
			for (let i = 0; i < userSelection.rangeCount; i++) {
				// const range = userSelection.getRangeAt(i);
				// const template = document.getElementById(
				// 	'highlightTemplate'
				// ) as HTMLTemplateElement;
				// const clone =
				// 	template.content.firstElementChild!.cloneNode(true);
				// clone.appendChild(range.extractContents());
				// range.insertNode(clone);
				//
				const range = userSelection.getRangeAt(i);
				const highlightContainer = document.createElement('span');
				range.surroundContents(highlightContainer);
				ReactDOM.render(
					<Highlight>{highlightContainer.innerHTML}</Highlight>,
					highlightContainer
				);
			}
			window.getSelection()?.empty();
		}
	};

	return (
		<>
			<div
				className='bg-slate-800 text-slate-400 ll-gap-3 gap-2 w-fit absolute justify-center items-center flex-row rounded-md border p-2 z-50 text-sm'
				style={markerPosition}
				onClick={handleHighlight}
			>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<Paintbrush className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<NotebookPen className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					<Heart className='w-full h-full' />
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					😂
				</button>
				<button className='hover:text-white hover:border-white border border-transparent cursor-pointer w-6 h-6 rounded-lg p-1 transition-colors duration-150'>
					🥲
				</button>
			</div>
			<div className='md:sticky top-0'>
				<header className='bg-red-800 md:bg-blue-500'>
					<p className='text-slate-800'>shmm</p>
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
