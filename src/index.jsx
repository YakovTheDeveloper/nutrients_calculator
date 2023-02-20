import { createRoot } from 'react-dom/client';
import { App } from './App';

const domNode = document.getElementById('root');
const root = createRoot(domNode);
root.render(<App />);

// if (module.hot) {
// 	module.hot.accept('./print.js', function () {
// 		console.log('Accepting the updated printMe module!');
// 		printMe();
// 	})
// }

if (module.hot) {
	module.hot.accept();
}