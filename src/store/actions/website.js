import cloneDeep from 'lodash/cloneDeep'

export const chooseWebsite = id => (dispatch, getState) => {
    const { mD } = getState()
    const userObject = cloneDeep(mD.userObject)
    userObject.settings.currentWebsite = id
    dispatch(saveObject(userObject))
}

export const saveObject = data => ({
    type: 'SAVE_OBJECT',
    data,
})

export const chooseUserInWebsiteSharing = (id: string) => ({
    type: 'CHOOSE_USER_IN_WEBSITE_SHARING',
    id,
})

export const setSizeIsChanging = (isChanging: boolean) => ({
    type: 'SIZE_IS_CHANGING',
    isChanging,
})

export const setCurrentTopTab = (currentTopTab: string) => ({
    type: 'SET_CURRENT_TOP_TAB',
    currentTopTab,
})

export const saveMainData = mD => ({
    type: 'SAVE_MAIN_DATA',
    mD,
})
