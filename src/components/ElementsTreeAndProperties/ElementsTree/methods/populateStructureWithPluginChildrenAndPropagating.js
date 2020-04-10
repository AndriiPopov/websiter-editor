import {
    checkIfCapital,
    // getCurrentResourceValue,
} from '../../../../utils/basic'

import {
    modulesPropertyNodes,
    allModules,
} from '../../../../utils/modulesIndex'

import type { resourceType } from '../../../../store/reducer/reducer'

export default (
    structure: $PropertyType<resourceType, 'structure'>,
    currentResource,
    pluginElementsStructures,
    pluginsStructure,
    mode,
    currentResourceItem
) => {
    let result = []
    let excludeItems = []
    for (let item of structure) {
        if (!item.childrenTo && !excludeItems.includes(item.id)) {
            result.push(item)
        }

        if (checkIfCapital(item.tag.charAt(0))) {
            const pluginItem = pluginsStructure.find(
                element => element.name === item.tag
            )
            if (pluginItem) {
                const pluginElementStructure =
                    pluginElementsStructures[pluginItem.id]

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
                    for (let child of neededChildren) {
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
                                    mode === 'plugin' ? currentResource : '',
                                path: [...item.path, item.id],
                                text: false,
                                isChildren: false,
                                forChildren: true,
                                tag: `Children for ${child.tag}`,
                            }
                            result.push(newElement)
                        }
                    }
                }
            }
        } else if (allModules.includes(item.tag)) {
            const neededChildrenNames = modulesPropertyNodes[item.tag] || []
            const currentChildren = structure.filter(element =>
                element.path.includes(item.id)
            )
            excludeItems = [
                ...excludeItems,
                ...currentChildren.map(element => element.id),
            ]
            for (let child of neededChildrenNames) {
                const existingChild = currentChildren.find(
                    element =>
                        element.childrenTo === child.id &&
                        element.forModule === item.id
                )
                if (existingChild) {
                    result = [
                        ...result,
                        {
                            ...existingChild,
                            tag: child.tag,
                        },
                        ...currentChildren.filter(element =>
                            element.path.includes(existingChild.id)
                        ),
                    ]
                } else {
                    const newElement = {
                        id: `${item.id}_childrenTo_${child.id}`,
                        childrenTo: child.id,
                        forModule: item.id,
                        sourcePlugin: mode === 'plugin' ? currentResource : '',
                        path: [...item.path, item.id],
                        text: false,
                        isChildren: false,
                        forChildren: true,
                        tag: child.tag,
                    }
                    result.push(newElement)
                }
            }
        }
    }
    if (mode === 'plugin') {
        if (!currentResourceItem.propagating) {
            result = result.filter(
                item =>
                    !(
                        item.id === 'element_02' ||
                        (item.path.length > 0 && item.path[0] === 'element_02')
                    )
            )
        } else {
            if (!result.find(item => item.id === 'element_02')) {
                result.unshift({
                    id: 'element_02',
                    path: [],
                    text: false,
                    isChildren: false,
                    forChildren: false,
                    tag: 'CMS variables',
                })
            }
        }
    }

    return result
}
