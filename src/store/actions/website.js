import axios from 'axios'

import * as actionTypes from './actionTypes'
import * as actions from './index'

export const saveAllWebsitesDataFromServer = (data: Object) => ({
    type: 'SAVE_ALL_WEBSITES_DATA_FROM_SERVER',
    data,
})

export const addWebsite = (duplicate?: boolean, currentWebsite?: string) => (
    dispatch: Object
) => {
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

export const loadWebsite = (_id: string) => (dispatch: Object) => {
    if (_id) {
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

export const chooseWebsite = (id: string) => ({
    type: 'CHOOSE_WEBSITE',
    id,
})

export const changeWebsiteProperty = (
    key: string,
    value: string,
    id: string
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

export const deleteWebsite = (_id: string) => (dispatch: Object) => {
    if (_id) {
        if (
            !window.confirm(
                'Are you sure you want to delete this website? All data in this website will be deleted including pages, files and plugins. However, your media files will not be removed.'
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
    type: actionTypes.ACTION_START,
})

export const actionSuccess = () => ({
    type: actionTypes.ACTION_SUCCESS,
})

export const actionFail = (error: string) => ({
    type: actionTypes.ACTION_FAIL,
    error,
})

export const setCurrentTopTab = (currentTopTab: string) => ({
    type: 'SET_CURRENT_TOP_TAB',
    currentTopTab,
})
