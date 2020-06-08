import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import { getCurrentResourceValue } from '../../../utils/basic'
import { resourceType } from '../../../Types/resource'
import { mDType } from '../../../Types/mD'
import { elementType } from '../../../Types/element'

export type refreshedPageStructureType = [string, resourceType, boolean]

export default (
    mD: mDType,
    pageDraft: resourceType,
    templateDraft: resourceType,
    globalSettings: boolean,
    templateId: string
): refreshedPageStructureType | false => {
    let currentId = pageDraft && pageDraft.currentId ? pageDraft.currentId : 0
    const refreshPageStructure = (
        resourceDraft: resourceType,
        templateDraft: resourceType,
        templateId: string,
        pluginId?: string,
        currentPath?: Array<string>,
        arrayId?: string
    ): {
        structure?: resourceType['structure']
        values?: resourceType['values']
    } => {
        const getPagestructureWithoutPropagating = () => {
            const result = []
            for (let item of pageStructure) {
                if (
                    !item.path.find(el => {
                        // const innerEl = pageStructure.find(inner => inner.id === el)
                        if (
                            (resourceDraft.values[el] &&
                                resourceDraft.values[el].CMSVariableType &&
                                resourceDraft.values[
                                    el
                                ].CMSVariableType.indexOf('propagating_') ===
                                    0) ||
                            (resourceDraft.values[el] &&
                                resourceDraft.values[el].CMSVariableType ===
                                    'array')
                        )
                            return true
                        else return false
                    })
                )
                    // if (
                    //     resourceDraft.values[item.id].CMSVariableType &&
                    //     resourceDraft.values[item.id].CMSVariableType.indexOf(
                    //         'propagating_'
                    //     ) !== 0
                    //     // &&
                    //     // resourceDraft.values[item.id].CMSVariableType !== 'array'
                    // ) {
                    result.push(item)
                // }
            }
            return result
        }

        const getNewStructure = () => {
            return templateStructure.filter(item => {
                if (item.path.length > 0) {
                    if (item.path[0] === 'element_02') {
                        if (
                            !item.path.find(
                                el =>
                                    templateDraft.values[el] &&
                                    templateDraft.values[el].CMSVariableType &&
                                    (templateDraft.values[el]
                                        .CMSVariableType === 'array' ||
                                        templateDraft.values[
                                            el
                                        ].CMSVariableType.indexOf(
                                            'propagating_'
                                        ) === 0)
                            )
                        )
                            return true
                    }
                }
                return false
            })
        }

        const updateStructureWithIds = () => {
            if (!pluginId) {
                return newStructure.map(item => {
                    templateIds.push(item.id)
                    pageIds.push(item.id)
                    return {
                        ...item,
                        path: item.path.slice(1),
                        isCMSVariable: false,
                    }
                })
            } else {
                return newStructure
                    .map(item => {
                        const forPropagatingPlugin = {
                            pluginId,
                            variable: item.id,
                        }
                        const oldItem = pageStructureWithoutPropagating.find(
                            el =>
                                isEqual(
                                    el.forPropagatingPlugin,
                                    forPropagatingPlugin
                                )
                        )
                        if (oldItem) {
                            templateIds.push(item.id)
                            pageIds.push(oldItem.id)
                            return {
                                ...item,
                                forPropagatingPlugin,
                                id: oldItem.id,
                                isCMSVariable: false,
                            }
                        } else {
                            const newId = 'elementCMS_' + currentId
                            currentId++
                            templateIds.push(item.id)
                            pageIds.push(newId)

                            return {
                                ...item,
                                id: newId,
                                forPropagatingPlugin,
                                isCMSVariable: false,
                            }
                        }
                    })
                    .map(item => {
                        return {
                            ...item,
                            path: [
                                ...(currentPath || []),
                                ...item.path
                                    .slice(item.path.indexOf(arrayId || '') + 1)
                                    .filter(el => el !== 'element_02')
                                    .map(
                                        el => pageIds[templateIds.indexOf(el)]
                                    ),
                            ],
                        }
                    })
            }
        }

        // const getPropagatingVariables = () => {
        //     const result = []
        //     for (let item of newStructure) {
        //         const itemIdInTemplate = templateIds[pageIds.indexOf(item.id)]
        //         if (
        //             templateDraft.values[
        //                 itemIdInTemplate
        //             ].CMSVariableType.indexOf('propagating_') === 0
        //         ) {
        //             result.push(item.id)
        //         }
        //     }
        //     return result
        // }

        if (!resourceDraft || !templateDraft) return {}

        const pageStructure = resourceDraft.structure
        const templateStructure = templateDraft.structure
        if (!templateStructure || !pageStructure) return {}

        // Filter out all elements in propagating plugins.
        const pageStructureWithoutPropagating: Array<
            elementType
        > = getPagestructureWithoutPropagating()

        // Get new structure by copying the template structure without inner elements of arrays and propagating plugins
        let newStructure = getNewStructure()

        const templateIds: Array<string> = []
        const pageIds: Array<string> = []
        // Update new structure with ids of page elements
        newStructure = updateStructureWithIds()

        // const propagatingPluginsVariablesIds = getPropagatingVariables()

        let newValues: resourceType['values'] = {}

        let structureWithOldAndPropagating: resourceType['structure'] = []
        for (let item of newStructure) {
            const itemIdInTemplate = templateIds[pageIds.indexOf(item.id)]
            const itemValue = templateDraft.values[itemIdInTemplate]
            const oldItem = resourceDraft.structure.find(
                itemInn => itemInn.id === item.id
            )
            let newItem = {
                ...item,
                CMSVariableType: itemValue.CMSVariableType,
            }
            if (oldItem) newItem = { ...newItem, expanded: oldItem.expanded }
            newValues[item.id] = {
                ...templateDraft.values[itemIdInTemplate],
                value: '',
                menuItems: [],
                currentMenuItem: '',
                currentMenuId: 0,
                // properties: {},

                ...(resourceDraft.values[item.id] || {}),
                CMSVariableType:
                    templateDraft.values[itemIdInTemplate].CMSVariableType,
            }

            structureWithOldAndPropagating.push({
                ...newItem,
                // path: item.path.filter(
                //     id => !propagatingPluginsVariablesIds.includes(id)
                // ),
            })
            if (itemValue.CMSVariableType.indexOf('propagating_') === 0) {
                const children = pageStructure.filter(el =>
                    isEqual(el.path, [...item.path, item.id])
                )
                const childTemplateId = itemValue.CMSVariableType.slice(
                    'propagating_'.length
                )
                const childTemplateDraft = getCurrentResourceValue(
                    childTemplateId,
                    mD.resourcesObjects
                )
                for (let child of children) {
                    const innerChildPath = [...child.path, child.id]
                    const childrenOfItem = pageStructure.filter(el =>
                        isEqual(
                            el.path.slice(0, innerChildPath.length),
                            innerChildPath
                        )
                    )
                    const valuesOfChildren: resourceType['values'] = {}
                    for (let el of childrenOfItem) {
                        valuesOfChildren[el.id] = pageDraft.values[el.id]
                    }
                    let { structure, values } = refreshPageStructure(
                        {
                            ...resourceDraft,
                            structure: childrenOfItem,
                            values: valuesOfChildren,
                        },
                        childTemplateDraft,
                        templateId,
                        childTemplateId,
                        innerChildPath,
                        arrayId
                    )
                    if (!structure || !values) {
                        structure = childrenOfItem
                        values = pageDraft.values
                    }
                    structureWithOldAndPropagating = [
                        ...structureWithOldAndPropagating,
                        child,
                        ...structure,
                    ]
                    newValues = {
                        ...newValues,
                        ...values,
                        [child.id]: pageDraft.values[child.id],
                    }
                }
            }

            if (itemValue.CMSVariableType === 'array') {
                const children = pageStructure.filter(el =>
                    isEqual(el.path, [...item.path, item.id])
                )
                const childTemplateDraft: resourceType = {
                    ...templateDraft,
                    structure: templateDraft.structure.filter(
                        el =>
                            el.path.includes(item.id) ||
                            (item.forPropagatingPlugin &&
                                el.path.includes(
                                    item.forPropagatingPlugin.variable
                                ))
                    ),
                    values: {},
                }
                for (let el of childTemplateDraft.structure) {
                    childTemplateDraft.values[el.id] =
                        templateDraft.values[el.id]
                }

                for (let child of children) {
                    const innerChildPath = [...child.path, child.id]
                    const childrenOfItem = pageStructure.filter(el =>
                        isEqual(
                            el.path.slice(0, innerChildPath.length),
                            innerChildPath
                        )
                    )
                    const valuesOfChildren: resourceType['values'] = {}
                    for (let el of childrenOfItem) {
                        valuesOfChildren[el.id] = pageDraft.values[el.id]
                    }
                    let { structure, values } = refreshPageStructure(
                        {
                            ...resourceDraft,
                            structure: childrenOfItem,
                            values: valuesOfChildren,
                        },
                        childTemplateDraft,
                        templateId,
                        pluginId || templateId,
                        innerChildPath,
                        (item.forPropagatingPlugin &&
                            item.forPropagatingPlugin.variable) ||
                            item.id
                    )
                    if (!structure || !values) {
                        structure = childrenOfItem
                        values = valuesOfChildren
                    }
                    structureWithOldAndPropagating = [
                        ...structureWithOldAndPropagating,
                        child,
                        ...structure,
                    ]
                    newValues = {
                        ...newValues,
                        ...values,
                        [child.id]: pageDraft.values[child.id],
                    }
                }
            }
        }

        return {
            structure: structureWithOldAndPropagating,
            values: newValues,
        }
    }

    if (pageDraft && templateDraft) {
        const { structure, values } = refreshPageStructure(
            pageDraft,
            templateDraft,
            templateId
        )
        if (!structure || !values) return false
        const draft = {
            currentId,
            structure,
            values,
        }

        for (let item of pageDraft.structure.filter(
            item =>
                item.id === 'trash' ||
                (item.path.length > 0 && item.path[0] === 'trash')
        )) {
            draft.structure.push(item)
            draft.values[item.id] = pageDraft.values[item.id]
        }
        draft.structure = draft.structure.map(item => omit(item, 'itemPath'))

        if (
            !isEqual(
                draft.structure.map(item =>
                    omit(item, [
                        'expanded',
                        'children',
                        'itemPath',
                        'itemIndex',
                    ])
                ),
                pageDraft.structure.map(item =>
                    omit(item, [
                        'expanded',
                        'children',
                        'itemPath',
                        'itemIndex',
                    ])
                )
            ) ||
            !isEqual(draft.values, pageDraft.values)
        ) {
            return ['page', draft, globalSettings]
        }
    }

    return false
}
