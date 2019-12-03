import * as plugins from './plugins'
import * as auth from './auth'
import * as images from './images'
import * as resources from './resources'
import { createReducer } from 'redux-starter-kit'

export const initialState = {
    websites: [],
    resourcesObjects: {},
    pagesStructure: [],
    filesStructure: [],
    pluginsStructure: [],
    loadedWebsite: '',
    error: null,
    loading: false,
    currentPage: '',
    currentFile: '',
    currentPlugin: '',
    domainNotOk: false,
    storage: 0,
    images: [],
    uploadingImage: false,
    currentBoxInPlugin: '',
    currentImage: '',
    sizeIsChanging: false,
    currentWebsite: '',
    notSavedResources: [],
    pageZoom: 100,
    hoveredElementId: null,
    hoveredElementSize: {},
    isRefreshing: false,
    userId: null,
    barSizes: {
        height: 200,
        width: 500,
        width2: 200,
    },
    currentTopTab: 'page',
    findMode: null,
    hoverMode: '',
    fromFrame: false,
}

const saveAllWebsitesDataFromServer = (state, action) => {
    return {
        ...state,
        ...action.data,
        domainNotOk: false,
        currentPage:
            action.data.currentPage ||
            (state.resourcesObjects[state.currentPage]
                ? state.currentPage
                : ''),
        barSizes: { ...state.barSizes, ...action.data.barSizes },
        currentWebsite: action.data.loadedWebsite,
    }
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
    SAVE_ALL_WEBSITES_DATA_FROM_SERVER: (state, action) =>
        saveAllWebsitesDataFromServer(state, action),
    CHOOSE_WEBSITE: (state, action) => {
        state.currentWebsite = action.id
    },

    ACTION_START_IMAGE_UPLOAD: (state, action) =>
        images.actionStartImageUpload(state),
    ACTION_FAIL_IMAGE_UPLOAD: (state, action) =>
        images.actionFailImageUpload(state, action),
    ACTION_SUCCESS_IMAGE_UPLOAD: (state, action) =>
        images.actionSuccessImageUpload(state),
    CHOOSE_IMAGE: (state, action) => images.chooseImage(state, action),

    SAVE_IMAGE_AND_SIZE_IN_REDUX: (state, action) => {
        state.images = action.images || state.images
        state.storage = action.storage || state.storage
    },

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

    ADD_RESOURCE_SUCCESS: (state, action) =>
        resources.addResourceSuccess(state, action),
    DELETE_RESOURCE_SUCCESS: (state, action) =>
        resources.deleteResourceSuccess(state, action),
    SAVE_RESOURCES_STRUCTURE_SUCCESS: (state, action) =>
        resources.saveResourcesStructureSuccess(state, action),
    SET_CURRENT_RESOURCE: (state, action) =>
        resources.setCurrentResource(state, action),
    SAVE_RESOURCE_IN_STATE: (state, action) =>
        resources.saveResourceInState(state, action),
    REMOVE_RESOURCE_FROM_UNSAVED: (state, action) =>
        resources.removeResourceFromUnsaved(state, action),
    SAVE_RESOURCE_DRAFT_IN_STATE: (state, action) =>
        resources.saveResourceDraftInState(state, action),
    ADD_RESOURCE_VERSION: (state, action) =>
        resources.addResourceVersion(state, action),
    UNDO_RESOURCE_VERSION: (state, action) =>
        resources.undoResourceVersion(state, action),
    REDO_RESOURCE_VERSION: (state, action) =>
        resources.redoResourceVersion(state, action),

    CHOOSE_BOX_IN_PLUGIN: (state, action) =>
        plugins.chooseBoxInPlugin(state, action),
    ADD_BOX_IN_PLUGIN: (state, action) => plugins.addBoxInPlugin(state, action),
    DELETE_BOX_IN_PLUGIN: (state, action) =>
        plugins.deleteBoxInPlugin(state, action),
    DUPLICATE_BOX_IN_PLUGIN: (state, action) =>
        plugins.duplicateBoxInPlugin(state, action),
    CHANGE_BOX_PROPERTY_IN_PLUGIN: (state, action) =>
        plugins.changeBoxPropertyInPlugin(state, action),
    SAVE_STRUCTURE_IN_PLUGIN: (state, action) =>
        plugins.saveStructureInPlugin(state, action),

    AUTH_START: (state, action) => auth.authStart(state),
    AUTH_SUCCESS: (state, action) => auth.authSuccess(state, action),
    AUTH_FAIL: (state, action) => auth.authFail(state, action),
    AUTH_LOGOUT: (state, action) => auth.authLogout(state),
    CHANGE_BAR_SIZE: (state, action) => auth.changeBarSize(state, action),
    SET_CURRENT_TOP_TAB: (state, action) => {
        state.currentTopTab = action.currentTopTab
    },

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
})

export default reducer
