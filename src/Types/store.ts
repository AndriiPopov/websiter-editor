import { websiteType } from './website'
import { templateType } from './template'
import { resourceObjectType } from './resourceObject'
import { userType } from './user'
import { mDType } from './mD'
import { pinnedElementType } from './pinnedElement'

export type storeType = {
    websites: Array<websiteType>
    resourcesObjects: {
        [key: string]: resourceObjectType | userType | websiteType
    }
    pagesStructure: Array<templateType>
    pluginsStructure: Array<templateType>
    templatesStructure: Array<templateType>
    loadedWebsite: string
    error: null | {}
    loading: boolean
    currentPage: string
    currentPlugin: string
    currentTemplate: string
    domainNotOk: boolean
    customDomainNotOk: boolean
    maxStorage: number
    uploadingImage: boolean
    currentBoxInPlugin: string
    currentImage: string
    sizeIsChanging: boolean
    currentWebsite: string
    notSavedResources: Array<string>
    pageZoom: number
    hoveredElementId: null | string
    hoveredElementSize: {
        [key: string]: {
            children: {}
            left: number
            top: number
            width: number
            height: number
        }
    }
    isRefreshing: boolean
    userId: null | string
    barSizes: { height: number; width: number; width2: number; width3: number }
    // currentTopTab: string,
    findMode: null | string
    hoverMode: string
    fromFrame: boolean
    search: {}
    tryWebsiter: boolean
    currentUserInWebsiteSharing: string
    currentSiteBuilderMode: 'template' | 'page' | ''
    accountInfo: {
        displayName?: string
        emails?: Array<string>
        photos?: Array<string>
    }
    mD: mDType
    shouldRefresh?: boolean
    pinnedElements: Array<pinnedElementType>
    activePinnedElement: string
    currentPinnedElementId: number
    activeTab: 'page' | 'template' | 'plugin' | 'file' | 'website' | 'account'
}
