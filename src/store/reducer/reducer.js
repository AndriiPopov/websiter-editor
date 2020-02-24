import * as auth from './auth'
import * as images from './images'
import * as resources from './resources'
import { createReducer } from '@reduxjs/toolkit'
import resourcesAreEqual from '../../utils/resourcesAreEqual'

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

export type requiredRightsType = Array<string>

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
    isElementFromCMSVariable?: boolean,
    isCMSVariable?: boolean,
    CMSVariableType?: string,
    CMSVariableSystemName?: string,
    CMSVariableDescription?: string,
    CMSVariableDefaultValue?: any,
    currentMenuId?: string,
    defaultMenuItems?: Array<menuItemType>,
    value?: any,
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
    template: string,
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
    template: string,
    homepage: boolean,
    notPublished: boolean,
    hidden: boolean,
    connectedResources: {
        name: string,
        type: string,
    },
}

export type templateType = {
    id: string,
    path: Array<string>,
    name: string,
    url: string,
    template: string,
    homepage: boolean,
    notPublished: boolean,
    hidden: boolean,
    connectedResources: {
        name: string,
        type: string,
    },
}

export type imageType = {
    name: string,
    label: string,
    url: string,
    size: number,
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
    domainNoIndex?: boolean,
    sharing: Array<{
        userId: string,
        rights: Array<string>,
    }>,
    user: string,
    storage: number,
    images: Array<imageType>,
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
    templatesStructure: Array<templateType>,
    loadedWebsite: string,
    error: null | {},
    loading: boolean,
    currentPage: string,
    currentPlugin: string,
    currentTemplate: string,
    domainNotOk: boolean,
    customDomainNotOk: boolean,
    maxStorage: number,
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
    tryWebsiter: boolean,
    currentUserInWebsiteSharing: string,
    currentSiteBuilderMode: 'template' | 'page' | '',
    accountInfo: {
        displayName?: string,
        emails?: Array<string>,
        photos?: Array<string>,
    },
}

export const initialState: initialStateType = {
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
    currentTopTab: 'page',
    findMode: null,
    hoverMode: '',
    fromFrame: false,
    search: {},
    shouldRefresh: false,
    tryWebsiter: false,
    currentUserInWebsiteSharing: '',
    // currentSiteBuilderMode: '',
    mD: {},
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
    UNDO_RESOURCE_VERSION: (state, action) =>
        resources.undoResourceVersion(state, action),
    REDO_RESOURCE_VERSION: (state, action) =>
        resources.redoResourceVersion(state, action),

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
})

export default reducer
