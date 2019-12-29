import { omit, isEqual } from 'lodash'
import { getCurrentResourceValue } from '../../../utils/basic'

import type Props from '../SiteBuilder'

export default (newProps: Props) => {
    if (!newProps.resourcesObjects[newProps.currentPage]) return
    const structure =
        newProps.resourcesObjects[newProps.currentPage].present.structure ||
        newProps.resourcesObjects[newProps.currentPage].draft.structure
    if (!structure) return
    return structure
        .filter(itemInn => isEqual(itemInn.path, ['element_-1', 'element_0']))
        .map(itemInn => {
            let Tag = itemInn.tag || 'link'
            Tag = Tag.replace(/[^a-zA-Z]/g, '')
            Tag = Tag.length > 0 ? Tag : 'link'
            if (
                [
                    'meta',
                    'title',
                    'link',
                    'base',
                    'style',
                    'script',
                    'noscript',
                ].includes(Tag)
            ) {
                const properties = omit(itemInn.properties, ['style'])
                let propertiesString = ''
                for (let attr in properties)
                    propertiesString += attr + ' ="' + properties[attr] + '" '

                return ['meta', 'title', 'link', 'base'].includes(Tag)
                    ? `<${Tag} ${propertiesString} />`
                    : `<${Tag} ${propertiesString} ></${Tag}>`
            }
        })
        .join(' ')
}
