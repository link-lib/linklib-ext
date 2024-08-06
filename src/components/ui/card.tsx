import * as React from 'react';

import { cn } from '@/lib/utils';

const Card = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn(
			' bb-rounded-xl bb-border bb-bg-card bb-text-card-foreground bb-shadow',
			className
		)}
		{...props}
	/>
));
Card.displayName = 'Card';

const CardHeader = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('bb-flex bb-flex-col bb-space-y-1.5 bb-p-6', className)}
		{...props}
	/>
));
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
	<h3
		ref={ref}
		className={cn(
			'bb-font-semibold bb-leading-none bb-tracking-tight',
			className
		)}
		{...props}
	/>
));
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<
	HTMLParagraphElement,
	React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
	<p
		ref={ref}
		className={cn('bb-text-sm bb-text-muted-foreground', className)}
		{...props}
	/>
));
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div ref={ref} className={cn('bb-p-6 bb-pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<
	HTMLDivElement,
	React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
	<div
		ref={ref}
		className={cn('bb-flex bb-items-center bb-p-6 bb-pt-0', className)}
		{...props}
	/>
));
CardFooter.displayName = 'CardFooter';

export {
	Card,
	CardHeader,
	CardFooter,
	CardTitle,
	CardDescription,
	CardContent,
};
