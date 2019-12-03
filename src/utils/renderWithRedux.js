import React from 'react'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware } from 'redux'
import reducer from '../store/reducer/reducer'
import { render } from 'react-testing-library'
import thunk from 'redux-thunk'
import { Router } from 'react-router-dom'
import { createMemoryHistory } from 'history'

export default function renderWithRedux(
    ui: Object,
    {
        initialState,
        store = createStore(reducer, initialState, applyMiddleware(thunk)),
    }: Object = {}
) {
    return {
        ...render(<Provider store={store}>{ui}</Provider>),
        store,
    }
}

export function rerenderWithRedux(
    rerender: Object,
    ui: Object,
    {
        initialState,
        store = createStore(reducer, initialState, applyMiddleware(thunk)),
    }: Object = {}
) {
    return {
        ...rerender(<Provider store={store}>{ui}</Provider>),
        store,
    }
}

export function renderWithRouter(
    ui: Object,
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    }: Object = {}
) {
    return {
        ...render(<Router history={history}>{ui}</Router>),
        history,
    }
}

export function renderWithReduxAndRouter(
    ui: Object,
    {
        initialState,
        store = createStore(reducer, initialState, applyMiddleware(thunk)),
    }: Object = {},
    {
        route = '/',
        history = createMemoryHistory({ initialEntries: [route] }),
    }: Object = {}
) {
    return {
        ...render(
            <Provider store={store}>
                <Router history={history}>{ui}</Router>
            </Provider>
        ),
        store,
        history,
    }
}
