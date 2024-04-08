import { useEffect, useState } from 'react';

import {
	getMarkerPosition,
	getSelectedText,
} from '@/scripts/highlighter/utils/markerUtils';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

const styled = ({ display = 'none', left = 0, top = 0 }) => `
  #mediumHighlighter {
    align-items: center;
    background-color: black;
    border-radius: 5px;
    border: none;
    cursor: pointer;
    display: ${display};
    justify-content: center;
    left: ${left}px;
    padding: 5px 10px;
    position: fixed;
    top: ${top}px;
    width: 40px;
    z-index: 9999;
  }
  .text-marker {
    fill: white;
  }
  .text-marker:hover {
    fill: ${highlightColor};
  }
`;

const HighlighterApp = () => {
	const [markerPosition, setMarkerPosition] = useState<
		any | { display: 'none' }
	>({ display: 'none' });

	useEffect(() => {
		document.addEventListener('click', () => {
			if (getSelectedText().length > 0) {
				setMarkerPosition(styled(getMarkerPosition()));
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
					setMarkerPosition(styled(getMarkerPosition()));
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
		<>
			<div className='marker-container' style={markerPosition}>
				<div className='marker'></div>
			</div>
			<div className='App'>
				<header className='App-header bg-red-500'>
					<p className='text-blue-500'>shmm</p>
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
