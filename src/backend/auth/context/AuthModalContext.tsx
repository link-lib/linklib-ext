import React, { createContext, useState, ReactNode } from 'react';

interface AuthModalContextType {
	isOpen: boolean;
	setIsOpen: (isOpen: boolean) => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
	undefined
);

export const AuthModalProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isOpen, setIsOpen] = useState(false);

	return (
		<AuthModalContext.Provider value={{ isOpen, setIsOpen }}>
			{children}
		</AuthModalContext.Provider>
	);
};

export { AuthModalContext };
