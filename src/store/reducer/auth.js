export const authStart = (state: Object) => {
    state.loading = true
    state.error = null
}

export const authFail = (state: Object, action: Object) => {
    state.loading = false
    state.error = action.error
    state.userId = null
}

export const authLogout = (state: Object) => {
    state.userId = null
}

export const authSuccess = (state: Object, action: Object) => {
    state.userId = action.data._id
    state.accountInfo = action.data.accountInfo
    state.error = null
    state.loading = false
    state.barSizes = { ...state.barSizes, ...action.data.barSizes }
    state.tryWebsiter = action.data.tryWebsiter
}

export const changeBarSize = (state: Object, action: Object) => {
    state.barSizes[action.key] = action.value
}
