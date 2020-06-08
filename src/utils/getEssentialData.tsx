import { mDType } from '../Types/mD'
import { storeType } from '../Types/store'
import { userType } from '../Types/user'
import { websiteType } from '../Types/website'
import { resourceObjectType } from '../Types/resourceObject'
import { getCurrentResourceValue } from './basic'

export default (
    userId: storeType['userId'],
    resourcesObjects: storeType['resourcesObjects'],
    pinnedElements: storeType['pinnedElements'],
    tryWebsiter: storeType['tryWebsiter']
): mDType => {
    let userObject: userType | null = null,
        websites,
        currentWebsiteItem,
        currentWebsiteId,
        currentWebsiteObject,
        pagesStructure,
        templatesStructure,
        pluginsStructure,
        filesStructure,
        currentPageId = '',
        currentPageFSBId = '',
        currentTemplateId = '',
        currentPluginId = '',
        currentFileId = '',
        currentPageItem,
        currentPageFSBItem,
        currentTemplateItem,
        currentPluginItem,
        currentFileItem,
        currentPageObject,
        currentPageFSBObject,
        currentTemplateObject,
        currentPluginObject,
        currentPageDraft,
        currentPageFSBDraft,
        currentTemplateDraft,
        currentPluginDraft,
        globalSettingsPageId,
        globalSettingsPageObject,
        globalSettingsPageDraft,
        globalSettingsTemplateId,
        globalSettingsTemplateDraft,
        pageTemplateName = '',
        pageTemplateId = '',
        pageTemplateItem,
        pageTemplateObject,
        pageTemplateDraft,
        pageTemplateFSBName = '',
        pageTemplateFSBId = '',
        pageTemplateFSBItem,
        pageTemplateFSBObject,
        pageTemplateFSBDraft,
        nextFileId = 0,
        prod,
        pinnedElementsWithTitles
    if (userId) {
        userObject = resourcesObjects[userId] as userType

        if (userObject) {
            websites = userObject.websites
            if (websites) {
                if (websites.length > 0 && userObject.settings) {
                    if (userObject.settings.currentWebsite) {
                        currentWebsiteItem = websites.find(item => {
                            if (userObject)
                                return (
                                    item.id ===
                                    userObject.settings.currentWebsite
                                )
                        })
                    }
                    if (currentWebsiteItem) {
                        currentWebsiteId = currentWebsiteItem.id
                        currentWebsiteObject = resourcesObjects[
                            currentWebsiteId
                        ] as websiteType
                        if (currentWebsiteObject) {
                            pagesStructure = currentWebsiteObject.pagesStructure
                            templatesStructure =
                                currentWebsiteObject.templatesStructure
                            pluginsStructure =
                                currentWebsiteObject.pluginsStructure
                            filesStructure = currentWebsiteObject.filesStructure
                            nextFileId = currentWebsiteObject.nextFileId || 0

                            const currentWebsiteItemSettings =
                                userObject.settings.websites[currentWebsiteId]
                            if (currentWebsiteItemSettings) {
                                currentPageId =
                                    currentWebsiteItemSettings.currentPageId
                                currentPageFSBId =
                                    currentWebsiteItemSettings.currentPageFSBId
                                currentTemplateId =
                                    currentWebsiteItemSettings.currentTemplateId
                                currentPluginId =
                                    currentWebsiteItemSettings.currentPluginId
                                currentFileId =
                                    currentWebsiteItemSettings.currentFileId

                                currentPageItem = pagesStructure.find(
                                    item => item.id === currentPageId
                                )
                                currentPageFSBItem = pagesStructure.find(
                                    item => item.id === currentPageFSBId
                                )
                                currentTemplateItem = templatesStructure.find(
                                    item => item.id === currentTemplateId
                                )
                                currentPluginItem = pluginsStructure.find(
                                    item => item.id === currentPluginId
                                )
                                currentFileItem = filesStructure.find(
                                    item => item.id === currentFileId
                                )

                                if (currentPageItem) {
                                    currentPageObject = resourcesObjects[
                                        currentPageId
                                    ] as resourceObjectType
                                    if (currentPageObject) {
                                        currentPageDraft = !currentPageObject
                                            .present.structure
                                            ? currentPageObject.draft
                                            : currentPageObject.present
                                    }
                                    pageTemplateName =
                                        currentPageItem.template || ''
                                    if (pageTemplateName) {
                                        pageTemplateItem = templatesStructure.find(
                                            item =>
                                                item.name === pageTemplateName
                                        )
                                        if (pageTemplateItem) {
                                            pageTemplateId = pageTemplateItem.id
                                            pageTemplateObject = resourcesObjects[
                                                pageTemplateId
                                            ] as resourceObjectType
                                            if (pageTemplateObject) {
                                                pageTemplateDraft = !pageTemplateObject
                                                    .present.structure
                                                    ? pageTemplateObject.draft
                                                    : pageTemplateObject.present
                                            }
                                        }
                                    }
                                }
                                if (currentPageFSBItem) {
                                    currentPageFSBObject = resourcesObjects[
                                        currentPageFSBId
                                    ] as resourceObjectType
                                    if (currentPageFSBObject) {
                                        currentPageFSBDraft = !currentPageFSBObject
                                            .present.structure
                                            ? currentPageFSBObject.draft
                                            : currentPageFSBObject.present
                                    }
                                    pageTemplateFSBName =
                                        currentPageFSBItem.template || ''
                                    if (pageTemplateFSBName) {
                                        pageTemplateFSBItem = templatesStructure.find(
                                            item =>
                                                item.name ===
                                                    pageTemplateFSBName &&
                                                !item.hidden
                                        )
                                        if (pageTemplateFSBItem) {
                                            pageTemplateFSBId =
                                                pageTemplateFSBItem.id
                                            pageTemplateFSBObject = resourcesObjects[
                                                pageTemplateFSBId
                                            ] as resourceObjectType
                                            if (pageTemplateFSBObject) {
                                                pageTemplateFSBDraft = !pageTemplateFSBObject
                                                    .present.structure
                                                    ? pageTemplateFSBObject.draft
                                                    : pageTemplateFSBObject.present
                                            }
                                        }
                                    }
                                }

                                if (currentTemplateItem) {
                                    currentTemplateObject = resourcesObjects[
                                        currentTemplateId
                                    ] as resourceObjectType
                                    if (currentTemplateObject) {
                                        currentTemplateDraft = !currentTemplateObject
                                            .present.structure
                                            ? currentTemplateObject.draft
                                            : currentTemplateObject.present
                                    }
                                }
                                if (currentPluginItem) {
                                    currentPluginObject = resourcesObjects[
                                        currentPluginId
                                    ] as resourceObjectType
                                    if (currentPluginObject) {
                                        currentPluginDraft = !currentPluginObject
                                            .present.structure
                                            ? currentPluginObject.draft
                                            : currentPluginObject.present
                                    }
                                }

                                const globalSettingsPageItem = pagesStructure.find(
                                    item => item.generalSettings
                                )
                                if (globalSettingsPageItem) {
                                    globalSettingsPageId =
                                        globalSettingsPageItem.id
                                    globalSettingsPageObject = resourcesObjects[
                                        globalSettingsPageId
                                    ] as resourceObjectType
                                    if (globalSettingsPageObject) {
                                        globalSettingsPageDraft = !globalSettingsPageObject
                                            .present.structure
                                            ? globalSettingsPageObject.draft
                                            : globalSettingsPageObject.present
                                    }
                                }

                                const globalSettingsTemplateItem = templatesStructure.find(
                                    item => item.generalSettings
                                )
                                if (globalSettingsTemplateItem) {
                                    globalSettingsTemplateId =
                                        globalSettingsTemplateItem.id
                                    const globalSettingsTemplateObject = resourcesObjects[
                                        globalSettingsTemplateId
                                    ] as resourceObjectType
                                    if (globalSettingsTemplateObject) {
                                        globalSettingsTemplateDraft = !globalSettingsTemplateObject
                                            .present.structure
                                            ? globalSettingsTemplateObject.draft
                                            : globalSettingsTemplateObject.present
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    prod = process.env.NODE_ENV !== 'development'

    pinnedElementsWithTitles = pinnedElements
        .map(item => {
            const resourceDraft =
                item.resource &&
                getCurrentResourceValue(item.resource, resourcesObjects)
            if (resourceDraft) {
                const elementItem = resourceDraft.structure.find(
                    element => element.id === item.element
                )
                if (elementItem) {
                    return { ...item, title: elementItem.tag }
                }
            }
            return null
        })
        .filter(item => item !== null)

    return {
        userObject: userObject || null,
        websites,
        currentWebsiteItem,
        currentWebsiteId,
        currentWebsiteObject,
        pagesStructure: pagesStructure || [],
        templatesStructure: templatesStructure || [],
        pluginsStructure: pluginsStructure || [],
        filesStructure: filesStructure || [],
        currentPageId,
        currentPageFSBId,
        currentTemplateId,
        currentPluginId,
        currentFileId,
        currentPageItem,
        currentPageFSBItem,
        currentTemplateItem,
        currentPluginItem,
        currentFileItem,
        currentPageObject,
        currentPageFSBObject,
        currentTemplateObject,
        currentPluginObject,
        currentPageDraft,
        currentPageFSBDraft,
        currentTemplateDraft,
        currentPluginDraft,
        globalSettingsPageId,
        globalSettingsPageObject,
        globalSettingsPageDraft,
        globalSettingsTemplateId,
        globalSettingsTemplateDraft,
        pageTemplateName,
        pageTemplateId,
        pageTemplateItem,
        pageTemplateObject,
        pageTemplateDraft,
        pageTemplateFSBName,
        pageTemplateFSBId,
        pageTemplateFSBItem,
        pageTemplateFSBObject,
        pageTemplateFSBDraft,
        resourcesObjects,
        userId,
        tryWebsiter,
        nextFileId,
        prod,
        pinnedElementsWithTitles,
    }
}
