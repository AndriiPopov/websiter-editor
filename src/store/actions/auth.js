import axios from 'axios'
import Cookies from 'universal-cookie'
import jwt from 'jsonwebtoken'

import * as actions from './index'

import type { initialStateType } from '../../store/reducer/reducer'

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

export const deleteUser = () => (dispatch: Object) => {
    dispatch(deleteStart())
    return axios
        .delete('/api/users')
        .then(response => {
            dispatch(logout())
            dispatch(deleteSuccess())
        })
        .catch(err => {
            dispatch(deleteFail(err.message))
        })
}

export const logout = (all?: boolean) => {
    if (!all) {
        cookies.remove('auth_token')
        axios.defaults.headers.common['x-auth-token'] = null
        return {
            type: 'AUTH_LOGOUT',
        }
    } else {
        return axios
            .post('/api/auth/logoutall')
            .then(response => {
                cookies.remove('auth_token')
                axios.defaults.headers.common['x-auth-token'] = null
                return {
                    type: 'AUTH_LOGOUT',
                }
            })
            .catch(err => {})
    }
}

// export const auth = (email: string, password: string, isSignup?: boolean) => (
//     dispatch: Object
// ) => {
//     dispatch(authStart())
//     const authData = {
//         email,
//         password,
//     }

//     let url = '/api/users'
//     if (!isSignup) {
//         url = '/api/auth'
//     }
//     axios.defaults.headers.post['Content-Type'] = 'application/json'
//     axios.defaults.headers.put['Content-Type'] = 'application/json'
//     axios.defaults.headers.delete['Content-Type'] = 'application/json'
//     axios.defaults.headers.common.Accept = 'application/json'

//     return axios
//         .post(url, JSON.stringify(authData))
//         .then(response => {
//             localStorage.setItem('token', response.data.token)
//             localStorage.setItem('userId', response.data._id)
//             localStorage.setItem('currentAction', response.data.currentAction)
//             axios.defaults.headers.common['x-auth-token'] = response.data.token
//             dispatch(authSuccess(response.data))
//             dispatch(actions.saveAllWebsitesDataFromServer(response.data))
//         })
//         .catch(err => {
//             dispatch(authFail(err.message))
//         })
// }

export const authCheckState = () => (dispatch: Object) => {
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
        dispatch(authStart())
        return axios
            .get('/api/users')
            .then(response => {
                if (response.data.reload) {
                    sessionStorage.setItem(
                        'currentAction',
                        response.data.currentAction
                    )
                    window.location.reload()
                } else {
                    dispatch(
                        authSuccess({
                            ...response.data,
                            _id: userId._id,
                        })
                    )
                    dispatch(
                        actions.saveAllWebsitesDataFromServer(response.data)
                    )
                }
            })
            .catch(err => {
                dispatch(authFail(err.message))
            })
    }
}

export const changeBarSizeDo = (key: string, value: number) => ({
    type: 'CHANGE_BAR_SIZE',
    key,
    value,
})

export const savePropertiesOnLeave = (
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
    tooltipsOn: $PropertyType<initialStateType, 'tooltipsOn'>,
    currentPage: $PropertyType<initialStateType, 'currentPage'>,
    currentPlugin: $PropertyType<initialStateType, 'currentPlugin'>
) => (dispatch: Object) => {
    return axios
        .put('/api/users', { barSizes, tooltipsOn, currentPage, currentPlugin })
        .then(response => {})
        .catch(err => {})
}

export const changeBarSize = (
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
    initiator?: { key: string, value: number }
) => (dispatch: Object) => {
    const width = window.innerWidth,
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

export const switchTooltips = () => ({
    type: 'SWITCH_TOOLTIPS',
})
