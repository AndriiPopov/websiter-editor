import * as plugins from './plugins'
import * as auth from './auth'
import * as images from './images'
import * as resources from './resources'
import { createReducer } from 'redux-starter-kit'

export type menuItemType = {
    all: boolean,
    id: string,
    generatedFrom: string,
    sourceItem: boolean,
    name: string,
    type: string,
    path: Array<string>,
    properties: {
        url: string,
        class: string,
    },
}

export type elementType = {
    id: string,
    path: Array<string>,
    tag: string,
    properties: {
        name?: string,
        topMenuBlockClasses?: Array<string>,
        topMenuItemClasses?: Array<string>,
        topMenuItemActiveClasses?: Array<string>,
        popupMenuBlockClasses?: Array<string>,
        popupMenuItemClasses?: Array<string>,
        popupMenuItemActiveClasses?: Array<string>,
        mode?: 'horizontal' | 'vertical',
        trigger?: 'click',
        id?: string,
        class?: string,
    },
    propertiesString: string,
    style?: string,
    expanded?: boolean,
    textMode: string,
    cursorPosition?: {
        row: number,
        column: number,
    },
    text?: boolean,
    textContent?: string,
    isChildren?: boolean,
    childrenTo?: string,
    forPlugin?: string,
    sourcePlugin?: string,
    menuItems?: Array<menuItemType>,
    currentMenuItem?: string,
    children?: Array<elementType>,
}
export type resourceType = {
    currentId: number,
    structure: Array<elementType>,
    currentBox?: string,
    cursorPosition?: {
        row: number,
        column: number,
    },
    value?: string,
}

export type pageType = {
    id: string,
    path: Array<string>,
    name: string,
    url: string,
    homepage: boolean,
    hidden: boolean,
    notPublished: boolean,
    connectedResources: {
        name: string,
        type: string,
    },
}

export type pluginType = {
    id: string,
    path: Array<string>,
    name: string,
    url: string,
    homepage: boolean,
    notPublished: boolean,
    hidden: boolean,
    connectedResources: {
        name: string,
        type: string,
    },
}

export type websiteType = {
    _id: string,
    domain: string,
    name: string,
    customDomain?: string,
    domainHidden?: boolean,
    customDomainHidden?: boolean,
    customDomainVerified?: boolean,
    verifyCode?: string,
    cname?: string,
}

export type imageType = {
    name: string,
    label: string,
    url: string,
    size: number,
}

export type initialStateType = {
    websites: Array<websiteType>,
    resourcesObjects: {
        [key: string]: {
            draft: resourceType,
            present: resourceType,
            future: Array<resourceType>,
            past: Array<resourceType>,
        },
    },
    pagesStructure: Array<pageType>,
    pluginsStructure: Array<pluginType>,
    loadedWebsite: string,
    error: null | {},
    loading: boolean,
    currentPage: string,
    currentPlugin: string,
    domainNotOk: boolean,
    customDomainNotOk: boolean,
    storage: number,
    images: Array<imageType>,
    uploadingImage: boolean,
    currentBoxInPlugin: string,
    currentImage: string,
    sizeIsChanging: boolean,
    currentWebsite: string,
    notSavedResources: Array<string>,
    pageZoom: number,
    hoveredElementId: null | string,
    hoveredElementSize: {
        [key: string]: {
            children: {},
            left: number,
            top: number,
            width: number,
            height: number,
        },
    },
    isRefreshing: boolean,
    userId: null | string,
    barSizes: { height: number, width: number, width2: number, width3: number },
    currentTopTab: string,
    findMode: null | string,
    hoverMode: string,
    fromFrame: boolean,
    search: {},
    tooltipsOn: boolean,
}

export const initialState: initialStateType = {
    websites: [],
    resourcesObjects: {},
    pagesStructure: [],
    pluginsStructure: [],
    loadedWebsite: '',
    error: null,
    loading: false,
    currentPage: '',
    currentPlugin: '',
    domainNotOk: false,
    customDomainNotOk: false,
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
        width3: 200,
    },
    currentTopTab: 'page',
    findMode: null,
    hoverMode: '',
    fromFrame: false,
    search: {},
    tooltipsOn: true,
}

const saveAllWebsitesDataFromServer = (state, action) => {
    return {
        ...state,
        ...action.data,
        domainNotOk: false,
        customDomainNotOk: false,
        currentPage:
            action.data.currentPage ||
            (state.resourcesObjects[state.currentPage]
                ? state.currentPage
                : ''),
        hoveredElementSize: {},
        barSizes: { ...state.barSizes, ...action.data.barSizes },
        currentWebsite: action.data.loadedWebsite || state.currentWebsite,
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
    MARK_REFRESHING: (state: Object, action: Object) => {
        state.isRefreshing = action.refreshing
    },
    SWITCH_TOOLTIPS: (state: Object) => {
        state.tooltipsOn = !state.tooltipsOn
    },
})

export default reducer
