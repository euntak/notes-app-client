import React from 'react';
import ReactDOM from 'react-dom';
import configureStore from './redux/configureStore';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom'
import App from './containers/App';

const store = configureStore();

ReactDOM.render(
  <Provider store={store}>
    <Router>
      <App />
    </Router>
  </Provider>,
  document.getElementById('root')
);
