import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

const MenuToasts = () => {
	const { toast } = useToast();

	useEffect(() => {
		// Backend
		chrome.runtime.onMessage.addListener((request) => {
			if (request.type === 'saveImage') {
				console.log('Image saved');
				console.log(request);
				toast({
					duration: 3000,
					title: 'Image saved',
					description: 'Friday, February 10, 2023 at 5:57 PM',
				});
			}
		});

		// Backend
		chrome.runtime.onMessage.addListener((request) => {
			if (request.type === 'saveLink') {
				console.log('Link saved');
				console.log(request);
				toast({
					duration: 3000,
					title: 'Link saved',
					description: 'Friday, February 10, 2023 at 5:57 PM',
				});
			}
		});

		// Backend
		chrome.runtime.onMessage.addListener((request) => {
			if (request.type === 'saveVideo') {
				console.log('Video saved');
				console.log(request);
				toast({
					duration: 3000,
					title: 'Scheduled: Catch up',
					description: 'Friday, February 10, 2023 at 5:57 PM',
				});
			}
		});
	}, [toast]);

	return <div></div>;
};

export default MenuToasts;
