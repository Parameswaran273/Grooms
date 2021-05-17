import Cookies from 'universal-cookie';
const cookies = new Cookies();

if (cookies.get('selectedTheme') == undefined) {
    cookies.set('selectedTheme', 'blue', { path: '/' });
    document.body.classList.add(cookies.get('selectedTheme'));
}
else {
    document.body.classList.add(cookies.get('selectedTheme'));
}

const spinner = document.getElementById('preloader');
if (spinner && !spinner.hasAttribute('hidden')) {
    spinner.setAttribute('hidden', 'true');
}

import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom';
import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();
// Containers
import Layouts from './layout/Layout';

// Import Main styles for this application
import './scss/style.scss';
import 'antd/dist/antd.css';
import 'react-vertical-timeline-component/style.min.css';

// Connections
import thunk from 'redux-thunk';
import reducers from './reducers';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';

const createStoreWithMiddleware = applyMiddleware(thunk)(createStore);

ReactDOM.render((
    <Provider store={createStoreWithMiddleware(reducers)}>
        <HashRouter history={history}>
            <Switch>
                <Route path="/" component={Layouts} />
                <Redirect from="*" to="/" />
            </Switch>
        </HashRouter>
    </Provider>
), document.getElementById('container'));