import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './bootstrap.css'
import {Provider} from 'react-redux'
import store from './store';
import './assets/font/iconfont.css'
import './index.css'
import SocketService from './utils/socket_service';

import setupAxios from './utils/setupAxios'
setupAxios(store);


SocketService.Instance.connect();

ReactDOM.render(<Provider store={store} > <App /> </Provider> , document.getElementById('root'));
