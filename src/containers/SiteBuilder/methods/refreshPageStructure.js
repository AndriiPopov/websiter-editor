import type { resourceType } from '../../../store/reducer/reducer'

export default (
    resourceDraftStructure: resourceType,
    templateDraftStructure: resourceType
) => {
    if (!resourceDraftStructure || !templateDraftStructure) return

    const pageStructure = resourceDraftStructure
    if (!pageStructure) return

    const templateStructure = templateDraftStructure
    if (!templateStructure) return

    //$FlowFixMe
    return templateStructure
        .filter(item => {
            if (item.path.length > 0)
                if (item.path[0] === 'element_02') return true
            return false
        })
        .map((item, index) => ({
            ...item,
            path: item.path.slice(1),
        }))
}
