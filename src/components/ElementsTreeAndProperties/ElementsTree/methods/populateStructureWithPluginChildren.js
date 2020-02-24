import {
    checkIfCapital,
    // getCurrentResourceValue,
} from '../../../../utils/basic'

import type { Props } from '../ElementsTree'
import type { resourceType } from '../../../../store/reducer/reducer'

export default (
    structure: $PropertyType<resourceType, 'structure'>,
    currentResource,
    props: Props
) => {
    let result = []
    let excludeItems = []
    structure.forEach(item => {
        if (!item.childrenTo && !excludeItems.includes(item.id)) {
            result.push(item)
        }

        if (checkIfCapital(item.tag.charAt(0))) {
            const pluginItem = props.pluginsStructure.find(
                element => element.name === item.tag
            )
            if (pluginItem) {
                const pluginElementStructure =
                    props.pluginElementsStructures[pluginItem.id]

                if (pluginElementStructure) {
                    const neededChildren = pluginElementStructure.filter(
                        element => element.isChildren
                    )
                    const currentChildren = structure.filter(element =>
                        element.path.includes(item.id)
                    )
                    excludeItems = [
                        ...excludeItems,
                        ...currentChildren.map(element => element.id),
                    ]
                    neededChildren.forEach(child => {
                        const existingChild = currentChildren.find(
                            element => element.childrenTo === child.id
                        )
                        if (existingChild) {
                            result = [
                                ...result,
                                {
                                    ...existingChild,
                                    tag: `Children for ${child.tag}`,
                                },
                                ...currentChildren.filter(element =>
                                    element.path.includes(existingChild.id)
                                ),
                            ]
                        } else {
                            const newElement = {
                                id: `${item.id}_forPlugin_${
                                    pluginItem.id
                                }_childrenTo_${child.id}`,
                                childrenTo: child.id,
                                forPlugin: pluginItem.id,
                                sourcePlugin:
                                    props.mode === 'plugin'
                                        ? currentResource
                                        : '',
                                path: [...item.path, item.id],
                                text: false,
                                // textContent: '',
                                isChildren: false,
                                forChildren: true,
                                // properties: {},
                                tag: `Children for ${child.tag}`,
                            }
                            result.push(newElement)
                        }
                    })
                }
            }
        }
    })
    return result
}
