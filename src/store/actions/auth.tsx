import axios from 'axios'
import Cookies from 'universal-cookie'
import jwt from 'jsonwebtoken'

import * as actions from './index'

import { webSocket } from '../../components/ReserveWebsite/ReserveWebsite'

const cookies = new Cookies()

export const authStart = () => ({
    type: 'AUTH_START',
})

export const authSuccess = (data: Object) => ({
    type: 'AUTH_SUCCESS',
    data,
})

export const authFail = (error: string) => ({
    type: 'AUTH_FAIL',
    error,
})

export const deleteStart = () => ({
    type: 'ACTION_START',
})

export const deleteSuccess = () => ({
    type: 'ACTION_SUCCESS',
})

export const deleteFail = (error: string) => ({
    type: 'ACTION_FAIL',
    error,
})

export const deleteUser = () => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    if (window.confirm('Are you sure you would like to delete your account?'))
        if (
            window.confirm(
                'This action cannot be reverted. All your websites will be deleted.'
            )
        )
            webSocket.send(
                JSON.stringify({
                    messageCode: 'deleteUser',
                })
            )
}

export const logout = (all?: boolean) => (dispatch: Object) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    if (!all) {
        cookies.remove('auth_token')
        axios.defaults.headers.common['x-auth-token'] = null
        dispatch(logoutDo())
    } else {
        if (webSocket) {
            webSocket.send(
                JSON.stringify({
                    messageCode: 'logoutAll',
                })
            )
        }
    }
}

const logoutDo = () => ({
    type: 'AUTH_LOGOUT',
})

export const authCheckState = () => (dispatch: Object) => {
    sessionStorage.setItem('systemRefresh', '0')
    const tryWebsiter = cookies.get('try_websiter')
    sessionStorage.removeItem('tryWebsiter')
    if (tryWebsiter) {
        cookies.remove('try_websiter', {
            path: '/',
        })
        sessionStorage.setItem('tryWebsiter', '1')
        dispatch(
            authSuccess({
                _id: 'try',
            })
        )
        return
    }
    const token = cookies.get('auth_token')
    const rememberMe = cookies.get('rememberme')
    if (rememberMe) {
        cookies.remove('rememberme', {
            path: '/',
        })
        if (rememberMe === 'false') {
            cookies.remove('auth_token', {
                path: '/',
            })
        }
    }
    const userId = jwt.decode(token)
    axios.defaults.headers.post['Content-Type'] = 'application/json'
    axios.defaults.headers.put['Content-Type'] = 'application/json'
    axios.defaults.headers.delete['Content-Type'] = 'application/json'
    axios.defaults.headers.common.Accept = 'application/json'

    if (!token || !userId) {
        dispatch(logout())
    } else {
        axios.defaults.headers.common['x-auth-token'] = token
        axios.defaults.headers.post['x-auth-token'] = token
        axios.defaults.headers.get['x-auth-token'] = token
        axios.defaults.headers.delete['x-auth-token'] = token
        axios.defaults.headers.put['x-auth-token'] = token
        dispatch(authStart())
        return axios
            .get('/api/users')
            .then(() => {
                sessionStorage.removeItem('tryWebsiter')
                dispatch(
                    authSuccess({
                        _id: userId._id,
                    })
                )
            })
            .catch(err => {
                cookies.remove('auth_token', {
                    path: '/',
                })
                dispatch(authFail(err.message))
            })
    }
}

export const changeBarSizeDo = (key: string, value: number) => ({
    type: 'CHANGE_BAR_SIZE',
    key,
    value,
})

export const savePropertiesOnLeave = () => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter')) return
    const { mD, barSizes } = getState()
    webSocket.send(
        JSON.stringify({
            messageCode: 'saveSettings',
            settings: {
                ...mD.userObject.settings,
                barSizes,
            },
        })
    )
}

export const changeBarSize = (initiator?: { key: string; value: number }) => (
    dispatch: Object,
    getState
) => {
    const { barSizes } = getState()
    const width = Math.max(window.innerWidth, 700),
        height = window.innerHeight
    let value, dif, dif2, value2, value3

    if (!initiator) {
        if (barSizes.height > height - 50) {
            dispatch(actions.changeBarSizeDo('height', height - 50))
        }
        if (barSizes.width > width - 100) {
            dispatch(actions.changeBarSizeDo('width', width - 100))
        }
        if (barSizes.width + barSizes.width2 > width - 50) {
            dispatch(
                actions.changeBarSizeDo('width2', width - barSizes.width - 50)
            )
        }
    } else {
        switch (initiator.key) {
            case 'height':
                value = initiator.value
                if (value < 50) value = 50
                if (value > height - 50) value = height - 50
                dispatch(actions.changeBarSizeDo('height', value))
                break
            case 'width':
                value = initiator.value
                if (value < 50) value = 50
                dif = value - barSizes.width
                value2 = barSizes.width2 - dif
                value3 = barSizes.width3
                if (value2 < 50) {
                    dif2 = value2 - 50
                    value2 = 50
                    value3 = barSizes.width3 + dif2
                    if (value3 < 50) value3 = 50
                }
                if (value + value2 + value3 + 50 > width) {
                    value = width - 150
                    value2 = 50
                    value3 = 50
                }
                dispatch(actions.changeBarSizeDo('width', value))
                dispatch(actions.changeBarSizeDo('width2', value2))
                dispatch(actions.changeBarSizeDo('width3', value3))
                break
            case 'width2':
                value2 = initiator.value
                value = barSizes.width
                dif = value2 - 50
                if (dif < 0) {
                    value = value + dif
                    if (value < 50) value = 50
                    dif2 = value - barSizes.width
                    value3 = barSizes.width3 - dif2
                    value2 = 50
                }
                dif = value + value2 - barSizes.width - barSizes.width2
                value3 = barSizes.width3 - dif
                if (value3 < 50) value3 = 50
                if (value + value2 + value3 + 50 > width) {
                    value2 = width - value - 100
                }
                dispatch(actions.changeBarSizeDo('width', value))
                dispatch(actions.changeBarSizeDo('width2', value2))
                dispatch(actions.changeBarSizeDo('width3', value3))
                break
            case 'width3':
                value3 = initiator.value
                value = barSizes.width
                value2 = barSizes.width2
                dif = value3 - 50
                if (dif < 0) {
                    value2 = value2 + dif
                    dif2 = value2 - 50
                    if (dif2 < 0) {
                        value = value + dif2
                        if (value < 50) value = 50
                        value2 = 50
                    }
                    value3 = 50
                }
                if (value + value2 + value3 + 50 > width) {
                    value3 = width - value - value2 - 50
                }
                dispatch(actions.changeBarSizeDo('width', value))
                dispatch(actions.changeBarSizeDo('width2', value2))
                dispatch(actions.changeBarSizeDo('width3', value3))
                break
            default:
                break
        }
    }
}

export const setActiveTab = activeKey => ({
    type: 'SET_ACTIVE_TAB',
    activeKey,
})
