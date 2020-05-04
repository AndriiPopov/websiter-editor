// import type { resourceType } from '../../../store/reducer/reducer'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import omit from 'lodash/omit'
import { getCurrentResourceValue } from '../../../utils/basic'

export default (mD, pageDraft, templateDraft, globalSettings, templateId) => {
    // console.log('start')
    let currentId = pageDraft && pageDraft.currentId ? pageDraft.currentId : 0
    const refreshPageStructure = (
        resourceDraft,
        templateDraft,
        templateId,
        pluginId,
        currentPath,
        arrayId
    ) => {
        // console.log('startin')
        // console.log(cloneDeep(resourceDraft))
        // console.log(cloneDeep(templateDraft))
        if (!resourceDraft || !templateDraft)
            return { structure: [], values: {} }

        const pageStructure = resourceDraft.structure
        const templateStructure = templateDraft.structure
        if (!templateStructure || !pageStructure)
            return { structure: [], values: {} }

        const pageStructureWithoutPropagating = []
        for (let item of pageStructure) {
            if (
                resourceDraft.values[item.id].CMSVariableType &&
                resourceDraft.values[item.id].CMSVariableType.indexOf(
                    'propagating_' !== 0
                )
                // &&
                // resourceDraft.values[item.id].CMSVariableType !== 'array'
            ) {
                pageStructureWithoutPropagating.push(item)
            }
        }

        const templateIds = []
        const pageIds = []

        let newStructure = templateStructure.filter(item => {
            if (item.path.length > 0) {
                if (item.path[0] === 'element_02') {
                    if (
                        !item.path.find(
                            el =>
                                templateDraft.values[el] &&
                                templateDraft.values[el].CMSVariableType ===
                                    'array'
                        )
                    )
                        return true
                }
            }
            return false
        })

        // console.log('cloneDeep(newStructure)')
        // console.log(cloneDeep(newStructure))
        // console.log(cloneDeep('pageStructureWithoutPropagating'))
        // console.log(cloneDeep(pageStructureWithoutPropagating))

        if (!pluginId) {
            newStructure = newStructure.map(item => {
                templateIds.push(item.id)
                pageIds.push(item.id)
                return {
                    ...item,
                    path: item.path.slice(1),
                    isCMSVariable: false,
                }
            })
        } else {
            newStructure = newStructure
                .map(item => {
                    const forPropagatingPlugin = { pluginId, variable: item.id }
                    const oldItem = pageStructureWithoutPropagating.find(el =>
                        isEqual(el.forPropagatingPlugin, forPropagatingPlugin)
                    )
                    // console.log('oldItem')
                    // console.log(oldItem)
                    // console.log(forPropagatingPlugin)
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
                    // console.log(arrayId)
                    // const arrayIndex = item.path.indexOf(arrayId)
                    // console.log([
                    //     ...currentPath,
                    //     ...item.path
                    //         .slice(item.path.indexOf(arrayId) + 1)
                    //         .filter(el => el !== 'element_02')
                    //         .map(el => pageIds[templateIds.indexOf(el)]),
                    // ])
                    // console.log(item.path)
                    // console.log(
                    //     item.path.filter(
                    //         (el, index) =>
                    //             el !== 'element_02' && index > arrayIndex
                    //     )
                    // )

                    // console.log('templateIds')
                    // console.log(templateIds)
                    // console.log('pageIds')
                    // console.log(pageIds)

                    return {
                        ...item,
                        path: [
                            ...currentPath,
                            ...item.path
                                .slice(item.path.indexOf(arrayId) + 1)
                                .filter(el => el !== 'element_02')
                                .map(el => pageIds[templateIds.indexOf(el)]),
                        ],
                    }
                })
        }
        // console.log('newStructure')
        // console.log(newStructure)

        const propagatingPluginsVariablesIds = []
        for (let item of newStructure) {
            const itemIdInTemplate = templateIds[pageIds.indexOf(item.id)]
            if (
                templateDraft.values[itemIdInTemplate].CMSVariableType.indexOf(
                    'propagating_' === 0
                )
            ) {
                propagatingPluginsVariablesIds.push(item.id)
            }
        }

        let newValues = {}

        let structureWithOldAndPropagating = []
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
            // console.log(item.path)
            // console.log(
            //     item.path.filter(
            //         id => !propagatingPluginsVariablesIds.includes(id)
            //     )
            // )
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
                    const { structure, values } = refreshPageStructure(
                        { structure: childrenOfItem, values: pageDraft.values },
                        childTemplateDraft,
                        templateId,
                        childTemplateId,
                        innerChildPath,
                        arrayId
                    )
                    // console.log(structure)
                    // console.log('structure')
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
                // console.log(cloneDeep(templateDraft))
                const childTemplateDraft = {
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
                    const valuesOfChildren = {}
                    for (let el of childrenOfItem) {
                        valuesOfChildren[el.id] = pageDraft.values[el.id]
                    }
                    // console.log(childrenOfItem)
                    const { structure, values } = refreshPageStructure(
                        { structure: childrenOfItem, values: valuesOfChildren },
                        childTemplateDraft,
                        templateId,
                        pluginId || templateId,
                        innerChildPath,
                        (item.forPropagatingPlugin &&
                            item.forPropagatingPlugin.variable) ||
                            item.id
                    )
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
        // console.log('fin in')

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

        // console.log('fin')
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
