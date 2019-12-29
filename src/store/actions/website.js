import axios from 'axios'

import type { initialStateType } from '../../store/reducer/reducer'

export const saveAllWebsitesDataFromServer = (data: Object) => ({
    type: 'SAVE_ALL_WEBSITES_DATA_FROM_SERVER',
    data,
})

export const addWebsite = (
    duplicate?: boolean,
    currentWebsite?: $PropertyType<initialStateType, 'loadedWebsite'>
) => (dispatch: Object) => {
    dispatch(actionStart())
    return axios
        .post(
            '/api/websites',
            JSON.stringify(
                duplicate && currentWebsite
                    ? {
                          duplicate,
                          currentWebsite,
                      }
                    : {}
            )
        )
        .then(response => {
            dispatch(saveAllWebsitesDataFromServer({ ...response.data }))
            dispatch(actionSuccess())
        })
        .catch(err => {
            dispatch(actionFail(err.message))
        })
}

export const loadWebsite = (
    _id: $PropertyType<initialStateType, 'loadedWebsite'>,
    notSavedResources: $PropertyType<initialStateType, 'notSavedResources'>
) => (dispatch: Object) => {
    if (_id) {
        if (notSavedResources.length > 0) {
            if (
                !window.confirm(
                    `Are you sure you want to load another website? All unsaved resources in the current website will be lost. There are ${
                        notSavedResources.length
                    } notsaved resources.`
                )
            )
                return
        }
        dispatch(actionStart())
        return axios
            .get(`/api/websites/${_id}`)
            .then(response => {
                dispatch(
                    saveAllWebsitesDataFromServer({
                        ...response.data,
                    })
                )
                dispatch(actionSuccess())
            })
            .catch(err => {
                dispatch(actionFail(err.message))
            })
    }
}

export const chooseWebsite = (
    id: $PropertyType<initialStateType, 'loadedWebsite'>
) => ({
    type: 'CHOOSE_WEBSITE',
    id,
})

export const verifyCustomDomain = (id: string) => (dispatch: Object) => {
    dispatch(actionStart())
    return axios
        .post(`/api/websites/verify/${id}`)
        .then(response => {
            dispatch(saveAllWebsitesDataFromServer(response.data))
            dispatch(actionSuccess())
        })
        .catch(err => {
            dispatch(actionFail(err.message))
        })
}

export const changeWebsiteProperty = (
    key: string,
    value: any,
    id: $PropertyType<initialStateType, 'loadedWebsite'>
) => (dispatch: Object) => {
    if (id) {
        dispatch(actionStart())
        return axios
            .put(
                `/api/websites/${id}`,
                JSON.stringify({
                    [key]: value,
                })
            )
            .then(response => {
                dispatch(saveAllWebsitesDataFromServer(response.data))
                dispatch(actionSuccess())
            })
            .catch(err => {
                dispatch(actionFail(err.message))
            })
    }
}

export const deleteWebsite = (
    _id: $PropertyType<initialStateType, 'loadedWebsite'>
) => (dispatch: Object) => {
    if (_id) {
        if (
            !window.confirm(
                'Are you sure you want to delete this website? All data in this website will be deleted including pages and plugins. However, your media files will not be removed.'
            )
        )
            return
        dispatch(actionStart())
        return axios
            .delete(`/api/websites/${_id}`)
            .then(response => {
                dispatch(
                    saveAllWebsitesDataFromServer({
                        ...response.data,
                    })
                )
                dispatch(actionSuccess())
            })
            .catch(err => {
                dispatch(actionFail(err.message))
            })
    }
}

export const setSizeIsChanging = (isChanging: boolean) => ({
    type: 'SIZE_IS_CHANGING',
    isChanging,
})

// export const loadGlobalsToStore = (
//     pagesStructure: pagesStructureType,
//     resourcesObjects: Object,
//     currentPage: string
// ) => ({
//     type: actionTypes.LOAD_GLOBALS_TO_STORE,
//     pagesStructure,
//     resourcesObjects,
//     currentPage,
// })

export const actionStart = () => ({
    type: 'ACTION_START',
})

export const actionSuccess = () => ({
    type: 'ACTION_SUCCESS',
})

export const actionFail = (error: string) => ({
    type: 'ACTION_FAIL',
    error,
})

export const setCurrentTopTab = (currentTopTab: string) => ({
    type: 'SET_CURRENT_TOP_TAB',
    currentTopTab,
})
