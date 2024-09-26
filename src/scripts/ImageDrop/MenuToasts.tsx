import { saveLink } from '@/backend/saveLink';
import { useToast } from '@/components/ui/use-toast';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../auth/context/AuthModalContext';
import { withAuth } from '@/backend/auth/withAuth';

const MenuToasts = () => {
	const { toast } = useToast();
	const authModalContext = useContext(AuthContext);

	useEffect(() => {
		chrome.runtime.onMessage.addListener((request) => {
			// TODO (backend) - save image on right click
			if (request.type === 'saveImage') {
				console.log('Image saved');
				console.log(request);
				toast({
					duration: 1500,
					title: 'Image saved',
					description: 'Friday, February 10, 2023 at 5:57 PM',
				});
			}
		});

		// TODO: For some reason this listener is triggering twice with each save
		chrome.runtime.onMessage.addListener((request) => {
			if (request.type === 'saveLink') {
				console.log('Link saved');
				console.log(request);
				withAuth(
					() =>
						saveLink(request.linkUrl)
							.then(() =>
								toast({
									duration: 3000,
									title: 'Link saved',
									description: request.linkUrl,
								})
							)
							.catch(() =>
								toast({
									duration: 3000,
									title: 'Failed to save link',
									description: request.linkUrl,
								})
							),
					authModalContext
				)();
			}
		});

		chrome.runtime.onMessage.addListener((request) => {
			// TODO (backend): save video
			if (request.type === 'saveVideo') {
				console.log('Video saved');
				console.log(request);
				toast({
					duration: 1500,
					title: 'Scheduled: Catch up',
					description: 'Friday, February 10, 2023 at 5:57 PM',
				});
			}
		});
	}, [toast, authModalContext]);

	return <div></div>;
};

export default MenuToasts;
