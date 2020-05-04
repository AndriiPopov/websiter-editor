import { initialState } from './reducer'

export const actionStartImageUpload = (state: Object) => ({
    ...state,
    error: null,
    loading: true,
})

export const actionSuccessImageUpload = (state: Object) => ({
    ...state,
    error: null,
    loading: false,
})

export const actionFailImageUpload = (state: Object, action: Object) => ({
    ...state,
    error: action.error,
    loading: false,
})

export const chooseImage = (state: Object = initialState, action: Object) => {
    state.currentImage = action.image
}
