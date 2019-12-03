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
    state.error = null
    state.loading = false
    state.storage = action.data.storage
    state.images = action.data.images
    state.barSizes = { ...state.barSizes, ...action.data.barSizes }
}

export const changeBarSize = (state: Object, action: Object) => {
    state.barSizes[action.key] = action.value
}
