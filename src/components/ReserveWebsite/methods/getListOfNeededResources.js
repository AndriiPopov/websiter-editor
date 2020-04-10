const addConnectedResources = (
    draft,
    id,
    newRequestedResourcesList,
    currentWebsiteObject,
    resourcesObjects
) => {
    if (!resourcesObjects[id])
        newRequestedResourcesList.push({
            id,
            type: 'resource',
        })
    if (draft)
        if (draft.connectedResources)
            draft.connectedResources.forEach(connectedResource => {
                let nextResourceItem
                if (connectedResource.type === 'plugin') {
                    nextResourceItem = currentWebsiteObject.pluginsStructure.find(
                        item => item.name === connectedResource.name
                    )
                }
                if (nextResourceItem) {
                    const nextResourceObject =
                        resourcesObjects[nextResourceItem.id]
                    let nextResourceDraft = {}
                    if (nextResourceObject) {
                        nextResourceDraft = nextResourceObject.present.structure
                            ? nextResourceObject.present
                            : nextResourceObject.draft
                    }
                    addConnectedResources(
                        nextResourceDraft,
                        nextResourceItem.id,
                        newRequestedResourcesList,
                        currentWebsiteObject,
                        resourcesObjects
                    )
                }
            })
}

export default props => {
    const { mD } = props
    let newRequestedResourcesList = []
    if (mD.userId && mD.resourcesObjects) {
        if (!mD.userObject) {
            newRequestedResourcesList.push({
                id: mD.userId,
                type: 'user',
            })
        } else {
            let currentWebsiteId = mD.currentWebsiteId
            for (let item of mD.websites) {
                newRequestedResourcesList.push({
                    id: item.id,
                    type: 'website',
                })
            }
            if (!currentWebsiteId) {
                if (mD.websites.length > 0) currentWebsiteId = mD.websites[0].id
                if (currentWebsiteId) {
                    props.chooseWebsite(currentWebsiteId)
                }
            } else {
                if (mD.currentPageId) {
                    // if (!mD.currentPageObject) {
                    //     newRequestedResourcesList.push({
                    //         id: mD.currentPageId,
                    //         type: 'resource',
                    //     })
                    // }

                    addConnectedResources(
                        mD.currentPageDraft,
                        mD.currentPageId,
                        newRequestedResourcesList,
                        mD.currentWebsiteObject,
                        mD.resourcesObjects
                    )
                    if (mD.pageTemplateId) {
                        addConnectedResources(
                            mD.pageTemplateDraft,
                            mD.pageTemplateId,
                            newRequestedResourcesList,
                            mD.currentWebsiteObject,
                            mD.resourcesObjects
                        )
                    }
                }
                if (mD.currentTemplateId) {
                    addConnectedResources(
                        mD.currentTemplateDraft,
                        mD.currentTemplateId,
                        newRequestedResourcesList,
                        mD.currentWebsiteObject,
                        mD.resourcesObjects
                    )
                }
                if (mD.currentPluginId) {
                    addConnectedResources(
                        mD.currentPluginDraft,
                        mD.currentPluginId,
                        newRequestedResourcesList,
                        mD.currentWebsiteObject,
                        mD.resourcesObjects
                    )
                }
                if (mD.globalSettingsPageId) {
                    addConnectedResources(
                        mD.globalSettingsPageDraft,
                        mD.globalSettingsPageId,
                        newRequestedResourcesList,
                        mD.currentWebsiteObject,
                        mD.resourcesObjects
                    )
                }
                if (mD.globalSettingsTemplateId) {
                    addConnectedResources(
                        mD.globalSettingsTemplateDraft,
                        mD.globalSettingsTemplateId,
                        newRequestedResourcesList,
                        mD.currentWebsiteObject,
                        mD.resourcesObjects
                    )
                }
            }
        }
    }
    newRequestedResourcesList = Array.from(new Set(newRequestedResourcesList))
    return newRequestedResourcesList
}
