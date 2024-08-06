import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
	'inline-flex bb-items-center bb-justify-center bb-whitespace-nowrap bb-rounded-md bb-text-sm bb-font-medium bb-transition-colors bb-focus-visible:outline-none bb-focus-visible:ring-1 bb-focus-visible:ring-ring bb-disabled:pointer-events-none bb-disabled:opacity-50',
	{
		variants: {
			variant: {
				default:
					'bg-primary bb-text-primary-foreground bb-shadow bb-hover:bg-primary/90',
				destructive:
					'bg-destructive bb-text-destructive-foreground bb-shadow-sm bb-hover:bg-destructive/90',
				outline:
					'border bb-border-input bb-bg-background bb-shadow-sm bb-hover:bg-accent bb-hover:text-accent-foreground',
				secondary:
					'bg-secondary bb-text-secondary-foreground bb-shadow-sm bb-hover:bg-secondary/80',
				ghost: 'bb-hover:bg-accent bb-hover:text-accent-foreground',
				link: 'bb-text-primary bb-underline-offset-4 bb-hover:underline',
			},
			size: {
				default: 'bb-h-9 bb-px-4 bb-py-2',
				sm: 'bb-h-8 bb-rounded-md bb-px-3 bb-text-xs',
				lg: 'bb-h-10 bb-rounded-md bb-px-8',
				icon: 'bb-h-9 bb-w-9',
			},
		},
		defaultVariants: {
			variant: 'default',
			size: 'default',
		},
	}
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	({ className, variant, size, asChild = false, ...props }, ref) => {
		const Comp = asChild ? Slot : 'button';
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			/>
		);
	}
);
Button.displayName = 'Button';

export { Button, buttonVariants };
