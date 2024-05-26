import { useState } from 'react';
import './App.css';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';

function App() {
	const [count, setCount] = useState(0);

	return (
		<>
			<div>
				<a href='https://vitejs.dev' target='_blank'>
					<img src={viteLogo} className='logo' alt='Vite logo' />
				</a>
				<a href='https://react.dev' target='_blank'>
					<img
						src={reactLogo}
						className='logo react'
						alt='React logo'
					/>
				</a>
			</div>
			<h1>Linklib</h1>
			<div className='card'>
				<button
					className='pb-2 mb-3'
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</button>
				<p className='text-center'>I don' think this is working</p>
			</div>
		</>
	);
}

export default App;
