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
						className='logo bb-react'
						alt='React logo'
					/>
				</a>
			</div>
			<h1>Linklib</h1>
			<div className='card'>
				<button
					className='bb-pb-2 bb-mb-3'
					onClick={() => setCount((count) => count + 1)}
				>
					count is {count}
				</button>
				<p className='bb-text-center'>I don' think this is working</p>
			</div>
		</>
	);
}

export default App;
