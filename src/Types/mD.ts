import { userType } from './user'
import { websiteType } from './website'
import { websiteItemType } from './websiteItem'
import { templateType } from './template'
import { imageType } from './image'
import { resourceType } from './resource'
import { resourceObjectType } from './resourceObject'
import { storeType } from './store'

export type mDType = {
    userObject: userType | null
    websites: Array<websiteItemType> | undefined
    currentWebsiteItem: websiteItemType | undefined
    currentWebsiteId: string | undefined
    currentWebsiteObject: websiteType | undefined
    pagesStructure: websiteType['pagesStructure']
    templatesStructure: websiteType['templatesStructure']
    pluginsStructure: websiteType['pluginsStructure']
    filesStructure: websiteType['filesStructure']
    currentPageId: string
    currentPageFSBId: string
    currentTemplateId: string
    currentPluginId: string
    currentFileId: string
    currentPageItem: templateType | undefined
    currentPageFSBItem: templateType | undefined
    currentTemplateItem: templateType | undefined
    currentPluginItem: templateType | undefined
    currentFileItem: imageType | undefined
    currentPageObject: resourceObjectType | undefined
    currentPageFSBObject: resourceObjectType | undefined
    currentTemplateObject: resourceObjectType | undefined
    currentPluginObject: resourceObjectType | undefined
    currentPageDraft: resourceType | undefined
    currentPageFSBDraft: resourceType | undefined
    currentTemplateDraft: resourceType | undefined
    currentPluginDraft: resourceType | undefined
    globalSettingsPageId?: string
    globalSettingsPageObject: resourceObjectType | undefined
    globalSettingsPageDraft: resourceType | undefined
    globalSettingsTemplateId?: string
    globalSettingsTemplateDraft: resourceType | undefined
    pageTemplateName?: string
    pageTemplateId?: string
    pageTemplateItem: templateType | undefined
    pageTemplateObject: resourceObjectType | undefined
    pageTemplateDraft: resourceType | undefined
    pageTemplateFSBName?: string
    pageTemplateFSBId?: string
    pageTemplateFSBItem: templateType | undefined
    pageTemplateFSBObject: resourceObjectType | undefined
    pageTemplateFSBDraft: resourceType | undefined
    resourcesObjects: storeType['resourcesObjects']
    userId: string | null
    tryWebsiter: boolean
    nextFileId?: number
    prod: boolean
}
