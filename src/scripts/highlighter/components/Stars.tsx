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
		const newRating = isHalf ? index - 0.5 : index;
		setRating(newRating);
		onRating(newRating);
	};

	const renderStars = () => {
		const stars = [];
		for (let i = 1; i <= 5; i++) {
			if (hoveredIndex !== null) {
				if (i < hoveredIndex || (i === hoveredIndex && !hoveredHalf)) {
					stars.push(
						<button key={i}>
							<Star
								className='w-4 h-4 cursor-pointer'
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
						<button key={i}>
							<StarHalf
								className='w-4 h-4 cursor-pointer'
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
						<button key={i}>
							<Star
								className='w-4 h-4 cursor-pointer'
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
					i <= Math.floor(rating) ||
					(i === Math.ceil(rating) && rating % 1 === 0)
				) {
					stars.push(
						<button key={i}>
							<Star
								className='w-4 h-4 cursor-pointer'
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
				} else if (i === Math.ceil(rating) && rating % 1 !== 0) {
					stars.push(
						<button key={i}>
							<StarHalf
								className='w-4 h-4 cursor-pointer'
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
						<button key={i}>
							<Star
								className='w-4 h-4 cursor-pointer'
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
		return <div className='flex flex-row gap-x-1'>{renderStars()}</div>;
	} else {
		return (
			<div className='flex flex-col gap-y-1'>
				{renderStars().reverse()}
			</div>
		);
	}
};
