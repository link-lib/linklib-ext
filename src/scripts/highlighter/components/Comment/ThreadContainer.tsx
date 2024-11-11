import React, { useEffect, useRef, useState, ReactNode } from 'react';

interface ThreadContainerProps {
	children: ReactNode;
}

const ThreadContainer: React.FC<ThreadContainerProps> = ({ children }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [noteOffset, setOffset] = useState(0);

	useEffect(() => {
		const adjustPosition = () => {
			if (containerRef.current) {
				const container = containerRef.current;
				const windowWidth = window.innerWidth;
				const containerRect = container.getBoundingClientRect();

				// Calculate the offset so that the right edge is 50px from the window's right edge
				const offset = windowWidth - 50 - containerRect.right;
				setOffset(offset);
			}
		};

		adjustPosition();
	}, []);

	return (
		<div className='relative inline'>
			<div
				ref={containerRef}
				className='absolute top-0 w-72 bg-popover rounded-lg p-3 linklib-ext'
				style={{ left: `${noteOffset}px` }}
			>
				{children}
			</div>
		</div>
	);
};

export default ThreadContainer;
