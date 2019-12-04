import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, compose } from 'redux'
import thunk from 'redux-thunk'
import axios from 'axios'

import './index.css'
import App from './App'
//import * as serviceWorker from './serviceWorker';
import reducer from './store/reducer/reducer'
import { logout } from './store/actions/index'
// $FlowFixMe
import 'react-sortable-tree/style.css'

// const composeEnhancers =
//     process.env.NODE_ENV === 'development'
//         ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
//         : null || compose
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__

if (process.env.NODE_ENV === 'development') {
    axios.defaults.baseURL = 'http://localhost:5000'
} else {
    axios.defaults.baseURL = 'https://api.websiter.dev'
}

export const store = createStore(
    reducer,
    composeEnhancers(applyMiddleware(thunk))
)

// set axios interceptors
axios.interceptors.request.use(function(config) {
    if (localStorage.getItem('currentAction')) {
        // $FlowFixMe
        config.headers.currentAction = localStorage.getItem('currentAction')
        localStorage.setItem(
            'currentAction',
            (parseInt(localStorage.getItem('currentAction')) + 1).toString()
        )
    }
    return config
})

axios.interceptors.response.use(
    function(response: { data: mixed }) {
        if (response.headers['x-auth-token'])
            axios.defaults.headers.common['x-auth-token'] =
                response.headers['x-auth-token']
        return response
    },
    function(error) {
        if (error.response) {
            if (parseInt(error.response.status) === 412) {
                store.dispatch(logout())
            }
        }
        return Promise.reject(error)
    }
)

const app = (
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)

const root = document.getElementById('root')
if (root !== null) {
    ReactDOM.render(app, root)
}

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
//serviceWorker.unregister();
