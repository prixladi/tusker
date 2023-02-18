/* @refresh reload */
import { render } from 'solid-js/web';

import App from './app';
import './styles/global.scss';

render(() => <App />, document.getElementById('root') as HTMLElement);
