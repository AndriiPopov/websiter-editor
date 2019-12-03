import axios from 'axios'
import mockAdapter from 'axios-mock-adapter'
import configureStore from 'redux-mock-store'
import thunk from 'redux-thunk'

import * as actionTypes from './actionTypes'
import * as actions from './auth'

const mockStore = configureStore([thunk])
//const store = mockStore({})

describe('actions', () => {
    it('should create an action to start auth', () => {
        const expectedAction = {
            type: actionTypes.AUTH_START,
        }
        expect(actions.authStart()).toEqual(expectedAction)
    })

    it('should create an action to success auth', () => {
        const expectedAction = {
            type: actionTypes.AUTH_SUCCESS,
            data: { testData: 1234 },
        }
        expect(actions.authSuccess({ testData: 1234 })).toEqual(expectedAction)
    })

    it('should create an action to fail auth', () => {
        const expectedAction = {
            type: actionTypes.AUTH_FAIL,
            error: 'Request failed with status code 400',
        }
        expect(actions.authFail('Request failed with status code 400')).toEqual(
            expectedAction
        )
    })

    it('should create an action to delete Start', () => {
        const expectedAction = {
            type: actionTypes.DELETE_START,
        }
        expect(actions.deleteStart()).toEqual(expectedAction)
    })

    it('should create an action to delete Success', () => {
        const expectedAction = {
            type: actionTypes.DELETE_SUCCESS,
        }
        expect(actions.deleteSuccess()).toEqual(expectedAction)
    })

    it('should create an action to delete fail', () => {
        const expectedAction = {
            type: actionTypes.DELETE_FAIL,
            error: 'Request failed with status code 400',
        }
        expect(
            actions.deleteFail('Request failed with status code 400')
        ).toEqual(expectedAction)
    })

    it('should create an action to delete user', async () => {
        const mock = new mockAdapter(axios)
        mock.onDelete('/api/users')
            .replyOnce(200, { success: true })
            .onDelete('/api/users')
            .replyOnce(400, { success: false })

        // mock.onPut('/api/websites/websiteId').reply( config => {
        //     if(JSON.parse(config.data).pagesStructure[0].url === 'bad_url') {
        //         return [200, {
        //             urlNotOk: true
        //         }]
        //     } else {
        //         return [200, {
        //             urlNotOk: false
        //         }]
        //     }
        // });

        const expectedActionsSuccess = [
            { type: actionTypes.DELETE_START },
            { type: actionTypes.AUTH_LOGOUT },
            { type: actionTypes.DELETE_SUCCESS },
        ]

        const expectedActionsFail = [
            { type: actionTypes.DELETE_START },
            {
                type: actionTypes.DELETE_FAIL,
                error: 'Request failed with status code 400',
            },
        ]
        const store = mockStore({})
        await store.dispatch(actions.deleteUser())
        expect(store.getActions()).toEqual(expectedActionsSuccess)

        const store2 = mockStore({})
        await store2.dispatch(actions.deleteUser())
        expect(store2.getActions()).toEqual(expectedActionsFail)
    })

    it('should logout user', () => {
        const expectedActionAuthSuccess = [{ type: actionTypes.AUTH_LOGOUT }]

        const store = mockStore({})

        localStorage.setItem('token', 'true')
        localStorage.setItem('userId', 'id')
        store.dispatch(actions.logout())
        expect(store.getActions()).toEqual(expectedActionAuthSuccess)
        expect(localStorage.getItem('token')).toBeUndefined()
        expect(localStorage.getItem('userId')).toBeUndefined()
    })

    it('should authenticate user', async () => {
        const mock = new mockAdapter(axios)
        mock.onPost('/api/auth')
            .replyOnce(200, {
                token: 'true',
                _id: 'id',
                currentAction: 'action',
            })
            .onPost('/api/auth')
            .replyOnce(400, { success: false })

        const expectedActionAuthSuccess = [
            { type: actionTypes.AUTH_START },
            {
                type: actionTypes.AUTH_SUCCESS,
                data: { token: 'true', _id: 'id', currentAction: 'action' },
            },
            {
                type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                data: { token: 'true', _id: 'id', currentAction: 'action' },
            },
        ]

        const expectedActionAuthFail = [
            { type: actionTypes.AUTH_START },
            {
                type: actionTypes.AUTH_FAIL,
                error: 'Request failed with status code 400',
            },
        ]

        const store = mockStore({})
        await store.dispatch(actions.auth('aaa@aaa.aaa', '123456', false))
        expect(store.getActions()).toEqual(expectedActionAuthSuccess)
        expect(localStorage.getItem('token')).toBe('true')
        expect(localStorage.getItem('userId')).toBe('id')

        const store2 = mockStore({})
        await store2.dispatch(actions.auth('aaa@aaa.aaa', '123456', false))
        expect(store2.getActions()).toEqual(expectedActionAuthFail)
    })

    it('should sign up user', async () => {
        const mock = new mockAdapter(axios)
        mock.onPost('/api/users')
            .replyOnce(200, {
                token: 'true',
                _id: 'id',
                currentAction: 'action',
            })
            .onPost('/api/users')
            .replyOnce(400, { success: false })

        const expectedActionAuthSuccess = [
            { type: actionTypes.AUTH_START },
            {
                type: actionTypes.AUTH_SUCCESS,
                data: { token: 'true', _id: 'id', currentAction: 'action' },
            },
            {
                type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                data: { token: 'true', _id: 'id', currentAction: 'action' },
            },
        ]

        const expectedActionAuthFail = [
            { type: actionTypes.AUTH_START },
            {
                type: actionTypes.AUTH_FAIL,
                error: 'Request failed with status code 400',
            },
        ]

        const store = mockStore({})
        await store.dispatch(actions.auth('aaa@aaa.aaa', '123456', true))
        expect(store.getActions()).toEqual(expectedActionAuthSuccess)
        expect(localStorage.getItem('token')).toBe('true')
        expect(localStorage.getItem('userId')).toBe('id')

        const store2 = mockStore({})
        await store2.dispatch(actions.auth('aaa@aaa.aaa', '123456', true))
        expect(store2.getActions()).toEqual(expectedActionAuthFail)
    })

    it('should check auth details from localstorage on start', async () => {
        const mock = new mockAdapter(axios)
        mock.onGet('/api/users')
            .replyOnce(200, { sampleData: 12345, currentAction: 'action' })
            .onGet('/api/users')
            .replyOnce(400, { success: false })

        const expectedActionAuthNull = [{ type: actionTypes.AUTH_LOGOUT }]

        localStorage.setItem('token', 'true')
        localStorage.removeItem('userId')
        const store0 = mockStore({})
        await store0.dispatch(actions.authCheckState())
        expect(store0.getActions()).toEqual(expectedActionAuthNull)
        expect(localStorage.getItem('token')).toBeUndefined()
        expect(localStorage.getItem('userId')).toBeUndefined()

        const expectedActionAuthSuccess = [
            { type: actionTypes.AUTH_START },
            {
                type: actionTypes.AUTH_SUCCESS,
                data: {
                    token: 'true',
                    _id: 'id',
                    sampleData: 12345,
                    currentAction: 'action',
                },
            },
            {
                type: actionTypes.SAVE_WEBSITE_DATA_FROM_SERVER,
                data: { sampleData: 12345, currentAction: 'action' },
            },
        ]

        localStorage.setItem('token', 'true')
        localStorage.setItem('userId', 'id')
        const store = mockStore({})
        await store.dispatch(actions.authCheckState())
        expect(store.getActions()).toEqual(expectedActionAuthSuccess)

        const expectedActionAuthFail = [
            { type: actionTypes.AUTH_START },
            {
                type: actionTypes.AUTH_FAIL,
                error: 'Request failed with status code 400',
            },
        ]

        const store2 = mockStore({})
        await store2.dispatch(actions.authCheckState())
        expect(store2.getActions()).toEqual(expectedActionAuthFail)
    })
})
