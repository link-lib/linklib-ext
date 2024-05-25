import { useState } from 'react';
import { Star, StarHalf } from 'lucide-react';

export const StarRating = ({ horizontal = true }: { horizontal?: boolean }) => {
	const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
	const [hoveredHalf, setHoveredHalf] = useState<boolean>(false);
	const [rating, setRating] = useState<number>(0);

	const handleMouseEnter = (index: number, isHalf: boolean) => {
		setHoveredIndex(index);
		setHoveredHalf(isHalf);
	};

	const handleMouseLeave = () => {
		setHoveredIndex(null);
		setHoveredHalf(false);
	};

	const handleClick = (index: number, isHalf: boolean) => {
		setRating(isHalf ? index + 0.5 : index + 1);
	};

	const renderStars = () => {
		const stars = [];
		for (let i = 0; i < 5; i++) {
			if (hoveredIndex !== null) {
				if (i < hoveredIndex || (i === hoveredIndex && !hoveredHalf)) {
					stars.push(
						<Star
							className='w-4 h-4'
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
					);
				} else if (i === hoveredIndex && hoveredHalf) {
					stars.push(
						<StarHalf
							className='w-4 h-4'
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
					);
				} else {
					stars.push(
						<Star
							className='w-4 h-4'
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
					);
				}
			} else {
				if (
					i < Math.floor(rating) ||
					(i === Math.floor(rating) && rating % 1 === 0)
				) {
					stars.push(
						<Star
							className='w-4 h-4'
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
					);
				} else if (i === Math.floor(rating) && rating % 1 !== 0) {
					stars.push(
						<StarHalf
							className='w-4 h-4'
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
					);
				} else {
					stars.push(
						<Star
							className='w-4 h-4'
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
