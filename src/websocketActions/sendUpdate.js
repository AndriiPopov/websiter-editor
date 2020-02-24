import { webSocket } from '../components/ReserveWebsite/ReserveWebsite'
import {
    resourceItemIndex,
    resourceDraftIndex,
} from '../utils/resourceTypeIndex'

const diffpatcher = require('jsondiffpatch/dist/jsondiffpatch.umd.js').create({
    objectHash: obj => obj.id,
    propertyFilter: (name, context) => name !== '__patch__',
})

export const sendUpdate = (
    type: 'user' | 'website' | 'page' | 'template' | 'plugin',
    changes: {},
    id: string
) => (dispatch, getState) => {
    if (sessionStorage.getItem('tryWebsiter'))
        return alert(
            'This function is not available in test mode. Please create your free account at https://my.websiter.dev/login'
        )
    const { mD } = getState()
    const oldResource = mD.resourcesObjects[id]
    if (oldResource) {
        let draft, currentDraft
        if (['page', 'template', 'plugin'].includes(type)) {
            draft = oldResource.draft
            currentDraft = mD[resourceDraftIndex[type]]
        } else {
            draft = oldResource
            currentDraft = oldResource
        }
        if (draft && changes) {
            const newResource = { ...currentDraft, ...changes }
            const patch = diffpatcher.diff(draft, newResource)
            if (patch) {
                if (webSocket && webSocket.readyState !== 3) {
                    webSocket.send(
                        JSON.stringify({
                            messageCode: 'updateResource',
                            type,
                            _id: id,
                            __patch__: patch,
                            __v: oldResource.__v,
                            markPublish: [
                                'page',
                                'template',
                                'plugin',
                            ].includes(type)
                                ? !mD[resourceItemIndex[type]].notPublished
                                : false,
                        })
                    )
                }
            }
        }
    }
}
