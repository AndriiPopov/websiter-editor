import * as auth from './auth'
import * as images from './images'
import * as resources from './resources'
import { createReducer } from '@reduxjs/toolkit'
import resourcesAreEqual from '../../utils/resourcesAreEqual'

export const initialState = {
    resourcesObjects: {},
    error: null,
    loading: false,
    domainNotOk: false,
    customDomainNotOk: false,
    maxStorage: 0,
    uploadingImage: false,
    currentBoxInPlugin: '',
    currentImage: '',
    sizeIsChanging: false,
    notSavedResources: [],
    newVersionResources: [],
    pageZoom: 100,
    hoveredElementId: null,
    hoveredElementSize: {},
    isRefreshing: false,
    userId: null,
    barSizes: {
        height: 200,
        width: 400,
        width2: 200,
        width3: 200,
    },
    // currentTopTab: 'page',
    findMode: null,
    hoverMode: '',
    fromFrame: false,
    search: {},
    shouldRefresh: false,
    tryWebsiter: false,
    currentUserInWebsiteSharing: '',
    // currentSiteBuilderMode: '',
    mD: {},
    activeContainer: '',
    clipboard: {},
}

const saveHoveredElementRect = (state, action) => {
    const checkAndCreatePath = (path, index, parent) => {
        if (index < path.length - 1) {
            if (!parent[path[index].id]) {
                parent[path[index].id] = {
                    plugin: path[index].plugin,
                    children: {},
                }
            }
            checkAndCreatePath(
                action.path,
                index + 1,
                parent[path[index].id].children
            )
        } else {
            parent[path[index].id] = {
                plugin: path[index].plugin,
                children: {},
                ...action.size,
            }
        }
    }
    if (action.path.length > 0)
        checkAndCreatePath(action.path, 0, state.hoveredElementSize)
}

const removeFromHoveredSizes = (state, action) => {
    // ,
    // removedElements,
    const checkAndRemoveElement = parent => {
        for (const item in parent) {
            if (parent[item].plugin === action.currentResource) {
                for (const child in parent[item].children) {
                    if (action.removedElements.includes(child))
                        delete parent[item].children[child]
                }
            } else {
                checkAndRemoveElement(parent.children)
            }
        }
    }
    checkAndRemoveElement(state.hoveredElementSize)
}

const toggleFindMode = (state, action) => {
    if (action.value) {
        if (state.findMode === action.value) {
            state.findMode = null
        } else {
            state.findMode = action.value
        }
    } else {
        state.findMode = null
    }
}

const reducer = createReducer(initialState, {
    REMOVE_RESOURCE_FROM_UNSAVED: (state, action) =>
        resources.removeResourceFromUnsaved(state, action),
    REMOVE_RESOURCE_FROM_NEW_VERSIONS: (state, action) =>
        resources.removeResourceFromNewVersions(state, action),
    ACTION_START_IMAGE_UPLOAD: (state, action) =>
        images.actionStartImageUpload(state),
    ACTION_FAIL_IMAGE_UPLOAD: (state, action) =>
        images.actionFailImageUpload(state, action),
    ACTION_SUCCESS_IMAGE_UPLOAD: (state, action) =>
        images.actionSuccessImageUpload(state),
    CHOOSE_IMAGE: (state, action) => images.chooseImage(state, action),

    SIZE_IS_CHANGING: (state, action) => {
        state.sizeIsChanging = action.isChanging
    },
    ACTION_START: (state, action) => {
        state.error = null
        state.pagesLoading = true
    },
    ACTION_FAIL: (state, action) => {
        state.error = action.error
        state.pagesLoading = false
    },
    ACTION_SUCCESS: (state, action) => {
        state.error = null
        state.pagesLoading = false
    },

    ADD_RESOURCE_VERSION: (state, action) =>
        resources.addResourceVersion(state, action),
    // UNDO_RESOURCE_VERSION: (state, action) =>
    //     resources.undoResourceVersion(state, action),
    // REDO_RESOURCE_VERSION: (state, action) =>
    //     resources.redoResourceVersion(state, action),

    AUTH_START: (state, action) => auth.authStart(state),
    AUTH_SUCCESS: (state, action) => auth.authSuccess(state, action),
    AUTH_FAIL: (state, action) => auth.authFail(state, action),
    AUTH_LOGOUT: (state, action) => auth.authLogout(state),
    CHANGE_BAR_SIZE: (state, action) => auth.changeBarSize(state, action),
    // SET_CURRENT_TOP_TAB: (state, action) => {
    //     state.currentTopTab = action.currentTopTab
    // },

    SAVE_HOVERED_ELEMENT_RECT: (state: Object, action: Object) =>
        saveHoveredElementRect(state, action),
    REMOVE_FROM_HOVERED_SIZES: (state: Object, action: Object) =>
        removeFromHoveredSizes(state, action),
    HOVER_ELEMENT: (state: Object, action: Object) => {
        state.hoveredElementId = action.id
        state.hoverMode = action.mode
        state.fromFrame = action.fromFrame
    },
    UNHOVER_ELEMENT: (state: Object, action: Object) => {
        state.hoveredElementId = null
        state.fromFrame = false
    },
    TOGGLE_FIND_MODE: (state: Object, action: Object) =>
        toggleFindMode(state, action),
    MARK_REFRESHING: (state: Object, action: Object) => {
        state.isRefreshing = action.refreshing
    },
    MARK_SHOULD_REFRESHING: (state: Object, action: Object) => {
        state.shouldRefresh = action.value
    },
    CHOOSE_USER_IN_WEBSITE_SHARING: (state: Object, action: Object) => {
        state.currentUserInWebsiteSharing = action.id
    },
    SET_CURRENT_SITEBUILDER_MODE: (state: Object, action: Object) => {
        state.currentSiteBuilderMode = action.mode
    },
    SAVE_MAIN_DATA: (state: Object, action: Object) => {
        state.mD = action.mD
    },
    //ws
    ADD_RESOURCE: (state: Object, action: Object) => {
        const { mD } = state
        if (action.data) {
            if (action.data._id) {
                if (mD.resourcesObjects[action.data._id]) {
                    if (mD.resourcesObjects[action.data._id].draft) {
                        state.resourcesObjects[action.data._id] = {
                            ...mD.resourcesObjects[action.data._id],
                            draft: action.data.draft,
                            __v: action.data.__v,
                        }
                        let saved
                        if (
                            !mD.resourcesObjects[action.data._id].present
                                .structure
                        )
                            saved = true
                        else
                            saved = resourcesAreEqual(
                                action.data.draft,
                                mD.resourcesObjects[action.data._id].present
                            )

                        if (saved) {
                            resources.removeResourceFromUnsaved(state, {
                                _id: action.data._id,
                            })
                            resources.removeResourceFromNewVersions(state, {
                                _id: action.data._id,
                            })
                        } else {
                            resources.addResourceToUnsaved(state, {
                                _id: action.data._id,
                            })
                            resources.addResourceToNewVersions(state, {
                                _id: action.data._id,
                            })
                        }
                    } else {
                        state.resourcesObjects[action.data._id] = {
                            ...state.resourcesObjects[action.data._id],
                            ...action.data,
                        }
                    }
                } else state.resourcesObjects[action.data._id] = action.data
                if (action.data._id.toString() === mD.userId.toString()) {
                    if (action.data.settings)
                        if (action.data.settings.barSizes)
                            state.barSizes = action.data.settings.barSizes
                }
            }
        }
    },

    DELETE_RESOURCE: (state: Object, action: Object) => {
        if (action.data) {
            delete state.resourcesObjects[action.data.resourceId]
        }
    },
    REVERT_RESOURCE: (state: Object, action: Object) => {
        if (action.data) {
            state.resourcesObjects[action.data._id].present = action.data.draft
            if (action.data.to === 'draft') {
                resources.removeResourceFromUnsaved(state, {
                    _id: action.data._id,
                })
                resources.removeResourceFromNewVersions(state, {
                    _id: action.data._id,
                })
            }
        }
    },
    SAVE_OBJECT: (state: Object, action: Object) => {
        if (action.data) {
            state.resourcesObjects[action.data._id] = action.data
        }
    },
    SET_ACTIVE_CONTAINER: (state: Object, action: Object) => {
        if (state.activeContainer !== action.container)
            state.activeContainer = action.container
    },
    UNSET_ACTIVE_CONTAINER: (state: Object, action: Object) => {
        if (state.activeContainer === action.container)
            state.activeContainer = ''
    },
    SAVE_TO_CLIPBOARD: (state: Object, action: Object) => {
        state.clipboard = action.data
    },
})

export default reducer
