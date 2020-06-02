import {
    checkIfCapital,
    getCurrentResourceValue,
    // getCurrentResourceValue,
} from '../../../../utils/basic'

import {
    modulesPropertyNodes,
    allModules,
} from '../../../../utils/modulesIndex'
import { resourceType } from '../../../../Types/resource'
import { templateType } from '../../../../Types/template'
import { websiteType } from '../../../../Types/website'
import {
    current as currentIndex,
    resourceDraftIndex,
    resourceItemIndex,
} from '../../../../utils/resourceTypeIndex'
import { mDType } from '../../../../Types/mD'
// import type { resourceType } from '../../../../store/reducer/reducer'

const populateStructureWithPluginChildrenAndPropagating = (
    mD: mDType,
    mode: string
) => {
    if (!mD) return null
    let resourceDraftStructure = null
    if (mD[resourceDraftIndex[mode]]) {
        resourceDraftStructure = mD[resourceDraftIndex[mode]].structure
    }

    const pluginElementsStructures = {}
    for (let item of mD.pluginsStructure) {
        let draft = getCurrentResourceValue(item.id, mD.resourcesObjects)
        pluginElementsStructures[item.id] = draft ? draft.structure : []
    }

    const populateStructure = (
        structure: resourceType['structure'],
        currentResource: string,
        pluginElementsStructures: { [key: string]: resourceType['structure'] },
        pluginsStructure: websiteType['pluginsStructure'],
        mode: string,
        currentResourceItem: templateType
    ): resourceType['structure'] => {
        let result: resourceType['structure'] = []
        let excludeItems: Array<string> = []
        for (let item of structure) {
            if (!item.childrenTo && !excludeItems.includes(item.id)) {
                result.push(item)
            }

            if (
                !excludeItems.includes(item.id) &&
                !['element_02', 'element_01', 'element_0'].includes(item.id)
            ) {
                if (checkIfCapital(item.tag.charAt(0))) {
                    const pluginItem = pluginsStructure.find(
                        element => element.name === item.tag
                    )
                    const currentChildren = structure.filter(element =>
                        element.path.includes(item.id)
                    )
                    let pluginExists
                    if (pluginItem) {
                        const pluginElementStructure =
                            pluginElementsStructures[pluginItem.id]

                        if (pluginElementStructure) {
                            pluginExists = true
                            const neededChildren = pluginElementStructure.filter(
                                element => element.isChildren
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
                                        ...populateStructure(
                                            currentChildren.filter(element =>
                                                element.path.includes(
                                                    existingChild.id
                                                )
                                            ),
                                            currentResource,
                                            pluginElementsStructures,
                                            pluginsStructure,
                                            mode,
                                            currentResourceItem
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
                                            mode === 'plugin'
                                                ? currentResource
                                                : '',
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
                    if (!pluginExists) {
                        result = [...result, ...currentChildren]
                        excludeItems = [
                            ...excludeItems,
                            ...currentChildren.map(element => element.id),
                        ]
                    }
                } else if (allModules.includes(item.tag)) {
                    const neededChildrenNames =
                        modulesPropertyNodes[item.tag] || []
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
                                ...populateStructure(
                                    currentChildren.filter(element =>
                                        element.path.includes(existingChild.id)
                                    ),
                                    currentResource,
                                    pluginElementsStructures,
                                    pluginsStructure,
                                    mode,
                                    currentResourceItem
                                ),
                            ]
                        } else {
                            const newElement = {
                                id: `${item.id}_childrenTo_${child.id}`,
                                childrenTo: child.id,
                                forModule: item.id,
                                sourcePlugin:
                                    mode === 'plugin' ? currentResource : '',
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
        }
        if (mode === 'plugin') {
            if (!currentResourceItem.propagating) {
                result = result.filter(
                    item =>
                        !(
                            item.id === 'element_02' ||
                            (item.path.length > 0 &&
                                item.path[0] === 'element_02')
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

    const structureWithPluginChildren = populateStructure(
        resourceDraftStructure,
        mD[currentIndex[mode]],
        pluginElementsStructures,
        mD.pluginsStructure,
        mode,
        mD[resourceItemIndex[mode]]
    )
    return { structureWithPluginChildren, pluginElementsStructures }
}
export default populateStructureWithPluginChildrenAndPropagating
