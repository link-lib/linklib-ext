import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

export const StarRating = ({
	horizontal = true,
	onRating,
	initialRating = 0,
}: {
	horizontal?: boolean;
	onRating: (rating: number) => void;
	initialRating?: number;
}) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [hoveredHalf, setHoveredHalf] = useState<boolean>(false);
	const [rating, setRating] = useState<number>(initialRating);

	const handleMouseEnter = (index: number, isHalf: boolean) => {
		setHoveredIndex(index);
		setHoveredHalf(isHalf);
	};

	const handleMouseLeave = () => {
		setHoveredIndex(null);
		setHoveredHalf(false);
	};

	const handleClick = (index: number, isHalf: boolean) => {
		console.log('click', index, isHalf);
		setRating(isHalf ? index + 0.5 : index);
		onRating(isHalf ? index + 0.5 : index);
	};

	const renderStars = () => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (hoveredIndex !== null) {
				if (i < hoveredIndex || (i === hoveredIndex && !hoveredHalf)) {
					stars.push(
						<button>
							<Star
								className='bb-w-4 bb-h-4 bb-cursor-pointer'
								key={i}
								fill='yellow'
								strokeWidth={1}
								onMouseMove={(e) =>
									handleMouseEnter(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
								onMouseLeave={handleMouseLeave}
								onClick={(e) =>
									handleClick(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
							/>
						</button>
					);
				} else if (i === hoveredIndex && hoveredHalf) {
					stars.push(
						<button>
							<StarHalf
								className='bb-w-4 bb-h-4 bb-cursor-pointer'
								key={i}
								fill='yellow'
								strokeWidth={1}
								onMouseMove={(e) =>
									handleMouseEnter(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
								onMouseLeave={handleMouseLeave}
								onClick={(e) =>
									handleClick(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
							/>
						</button>
					);
				} else {
					stars.push(
						<button>
							<Star
								className='bb-w-4 bb-h-4 bb-cursor-pointer'
								key={i}
								strokeWidth={1}
								onMouseMove={(e) =>
									handleMouseEnter(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
								onMouseLeave={handleMouseLeave}
								onClick={(e) =>
									handleClick(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
							/>
						</button>
					);
				}
			} else {
				if (
					i < Math.floor(rating) ||
					(i === Math.floor(rating) && rating % 1 === 0)
				) {
					stars.push(
						<button>
							<Star
								className='bb-w-4 bb-h-4 bb-cursor-pointer'
								key={i}
								fill='yellow'
								strokeWidth={1}
								onMouseMove={(e) =>
									handleMouseEnter(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
								onMouseLeave={handleMouseLeave}
								onClick={(e) =>
									handleClick(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
							/>
						</button>
					);
				} else if (i === Math.floor(rating) && rating % 1 !== 0) {
					stars.push(
						<button>
							<StarHalf
								className='bb-w-4 bb-h-4 bb-cursor-pointer'
								key={i}
								fill='yellow'
								strokeWidth={1}
								onMouseMove={(e) =>
									handleMouseEnter(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
								onMouseLeave={handleMouseLeave}
								onClick={(e) =>
									handleClick(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
							/>
						</button>
					);
				} else {
					stars.push(
						<button>
							<Star
								className='bb-w-4 bb-h-4 bb-cursor-pointer'
								key={i}
								strokeWidth={1}
								onMouseMove={(e) =>
									handleMouseEnter(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
								onMouseLeave={handleMouseLeave}
								onClick={(e) =>
									handleClick(
										i,
										e.nativeEvent.offsetX <
											e.currentTarget.clientWidth / 2
									)
								}
							/>
						</button>
					);
				}
			}
		}
		return stars;
	};

	if (horizontal) {
		return (
			<div className='bb-flex bb-flex-row bb-gap-x-1'>
				{renderStars()}
			</div>
		);
	} else {
		return (
			<div className='bb-flex bb-flex-col bb-gap-y-1'>
				{renderStars().reverse()}
			</div>
		);
	}
};
