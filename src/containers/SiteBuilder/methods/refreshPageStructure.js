import type { resourceType } from '../../../store/reducer/reducer'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import { getCurrentResourceValue } from '../../../utils/basic'

export default (mD, pageDraft, templateDraft, globalSettings, templateId) => {
    let currentId = pageDraft && pageDraft.currentId ? pageDraft.currentId : 0
    const refreshPageStructure = (
        resourceDraft: resourceType,
        templateDraft: resourceType,
        templateId,
        pluginId?: string,
        currentPath?: Array<string>,
        arrayId?: string
    ) => {
        if (!resourceDraft || !templateDraft)
            return { structure: [], values: {} }

        const pageStructure = resourceDraft.structure
        const templateStructure = templateDraft.structure
        if (!templateStructure || !pageStructure)
            return { structure: [], values: {} }

        //$FlowFixMe
        const pageStructureWithoutPropagating = []
        for (let item of pageStructure) {
            if (
                resourceDraft.values[item.id].CMSVariableType &&
                resourceDraft.values[item.id].CMSVariableType.indexOf(
                    'propagating_' !== 0
                ) &&
                resourceDraft.values[item.id].CMSVariableType !== 'array'
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
                    const arrayIndex = item.path.indexOf(arrayId)
                    return {
                        ...item,
                        path: [
                            ...currentPath,
                            ...item.path
                                .filter(
                                    (el, index) =>
                                        el !== 'element_02' &&
                                        index > arrayIndex
                                )
                                .map(el => pageIds[templateIds.indexOf(el.id)]),
                        ],
                    }
                })
        }

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
        //$FlowFixMe
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
            structureWithOldAndPropagating.push({
                ...newItem,
                path: item.path.filter(
                    id => !propagatingPluginsVariablesIds.includes(id)
                ),
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
                        isEqual(el.path, innerChildPath)
                    )
                    const { structure, values } = refreshPageStructure(
                        { structure: childrenOfItem, values: pageDraft.values },
                        childTemplateDraft,
                        templateId,
                        childTemplateId,
                        innerChildPath,
                        arrayId
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

            if (itemValue.CMSVariableType === 'array') {
                const children = pageStructure.filter(el =>
                    isEqual(el.path, [...item.path, item.id])
                )
                const childTemplateDraft = {
                    structure: templateDraft.structure.filter(el =>
                        el.path.includes(item.id)
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
                        isEqual(el.path, innerChildPath)
                    )
                    const { structure, values } = refreshPageStructure(
                        { structure: childrenOfItem, values: pageDraft.values },
                        childTemplateDraft,
                        templateId,
                        pluginId || templateId,
                        innerChildPath,
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
