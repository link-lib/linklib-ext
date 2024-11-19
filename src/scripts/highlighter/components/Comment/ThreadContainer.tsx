import { useEffect, useRef, useState, ReactNode, forwardRef } from 'react';

interface ThreadContainerProps {
	children: ReactNode;
}

const ThreadContainer = forwardRef<HTMLDivElement, ThreadContainerProps>(
	({ children }, forwardedRef) => {
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
					ref={(node) => {
						// Assign both refs
						containerRef.current = node;
						if (typeof forwardedRef === 'function') {
							forwardedRef(node);
						} else if (forwardedRef) {
							forwardedRef.current = node;
						}
					}}
					className='absolute top-0 linklib-ext'
					style={{ left: `${noteOffset}px` }}
				>
					{children}
				</div>
			</div>
		);
	}
);

ThreadContainer.displayName = 'ThreadContainer';

export default ThreadContainer;
