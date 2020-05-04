export default (userId, resourcesObjects, tryWebsiter) => {
    const userObject = resourcesObjects[userId]
    let websites,
        currentWebsiteItem,
        currentWebsiteId,
        currentWebsiteObject,
        pagesStructure = [],
        templatesStructure = [],
        pluginsStructure = [],
        filesStructure = [],
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
        currentFileObject,
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
        nextFileId = 0
    if (userObject) {
        websites = userObject.websites
        if (websites) {
            if (websites.length > 0 && userObject.settings) {
                if (userObject.settings.currentWebsite) {
                    currentWebsiteItem = websites.find(
                        item => item.id === userObject.settings.currentWebsite
                    )
                }
                if (currentWebsiteItem) {
                    currentWebsiteId = currentWebsiteItem.id
                    currentWebsiteObject = resourcesObjects[currentWebsiteId]
                    if (currentWebsiteObject) {
                        pagesStructure = currentWebsiteObject.pagesStructure
                        templatesStructure =
                            currentWebsiteObject.templatesStructure
                        pluginsStructure = currentWebsiteObject.pluginsStructure
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
                                currentPageObject =
                                    resourcesObjects[currentPageId]
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
                                        item => item.name === pageTemplateName
                                    )
                                    if (pageTemplateItem) {
                                        pageTemplateId = pageTemplateItem.id
                                        pageTemplateObject =
                                            resourcesObjects[pageTemplateId]
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
                                currentPageFSBObject =
                                    resourcesObjects[currentPageFSBId]
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
                                            item.name === pageTemplateFSBName &&
                                            !item.hidden
                                    )
                                    if (pageTemplateFSBItem) {
                                        pageTemplateFSBId =
                                            pageTemplateFSBItem.id
                                        pageTemplateFSBObject =
                                            resourcesObjects[pageTemplateFSBId]
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
                                currentTemplateObject =
                                    resourcesObjects[currentTemplateId]
                                if (currentTemplateObject) {
                                    currentTemplateDraft = !currentTemplateObject
                                        .present.structure
                                        ? currentTemplateObject.draft
                                        : currentTemplateObject.present
                                }
                            }
                            if (currentPluginItem) {
                                currentPluginObject =
                                    resourcesObjects[currentPluginId]
                                if (currentPluginObject) {
                                    currentPluginDraft = !currentPluginObject
                                        .present.structure
                                        ? currentPluginObject.draft
                                        : currentPluginObject.present
                                }
                            }
                            if (currentFileItem) {
                                currentFileObject =
                                    resourcesObjects[currentFileId]
                            }

                            const globalSettingsPageItem = pagesStructure.find(
                                item => item.generalSettings
                            )
                            if (globalSettingsPageItem) {
                                globalSettingsPageId = globalSettingsPageItem.id
                                globalSettingsPageObject =
                                    resourcesObjects[globalSettingsPageId]
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
                                const globalSettingsTemplateObject =
                                    resourcesObjects[globalSettingsTemplateId]
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
    return {
        userObject,
        websites,
        currentWebsiteItem,
        currentWebsiteId,
        currentWebsiteObject,
        pagesStructure,
        templatesStructure,
        pluginsStructure,
        filesStructure,
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
        currentFileObject,
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
    }
}
