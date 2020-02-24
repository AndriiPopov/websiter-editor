export default (userId, resourcesObjects, tryWebsiter) => {
    const userObject = resourcesObjects[userId]
    let websites,
        currentWebsiteItem,
        currentWebsiteId,
        currentWebsiteObject,
        pagesStructure = [],
        templatesStructure = [],
        pluginsStructure = [],
        currentPageId = '',
        currentTemplateId = '',
        currentPluginId = '',
        currentPageItem,
        currentTemplateItem,
        currentPluginItem,
        currentPageObject,
        currentTemplateObject,
        currentPluginObject,
        currentPageDraft,
        currentTemplateDraft,
        currentPluginDraft,
        pageTemplateName = '',
        pageTemplateId = '',
        pageTemplateItem,
        pageTemplateObject,
        pageTemplateDraft,
        tooltipsOff
    if (userObject) {
        websites = userObject.websites
        if (websites) {
            if (websites.length > 0 && userObject.settings) {
                tooltipsOff = userObject.settings.tooltipsOff
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

                        const currentWebsiteItemSettings =
                            userObject.settings.websites[currentWebsiteId]
                        if (currentWebsiteItemSettings) {
                            currentPageId =
                                currentWebsiteItemSettings.currentPageId
                            currentTemplateId =
                                currentWebsiteItemSettings.currentTemplateId
                            currentPluginId =
                                currentWebsiteItemSettings.currentPluginId

                            currentPageItem = pagesStructure.find(
                                item => item.id === currentPageId
                            )
                            currentTemplateItem = templatesStructure.find(
                                item => item.id === currentTemplateId
                            )
                            currentPluginItem = pluginsStructure.find(
                                item => item.id === currentPluginId
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
        currentPageId,
        currentTemplateId,
        currentPluginId,
        currentPageItem,
        currentTemplateItem,
        currentPluginItem,
        currentPageObject,
        currentTemplateObject,
        currentPluginObject,
        currentPageDraft,
        currentTemplateDraft,
        currentPluginDraft,
        pageTemplateName,
        pageTemplateId,
        pageTemplateItem,
        pageTemplateObject,
        pageTemplateDraft,
        resourcesObjects,
        userId,
        tryWebsiter,
        tooltipsOff,
    }
}
