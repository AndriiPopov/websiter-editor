import { allModules } from '../../../utils/modulesIndex'
import { checkIfCapital } from '../../../utils/basic'

export const canDropHandle = ({ node, nextParent, prevParent }) => {
    if (!nextParent) return false
    if (!nextParent.itemPath) return false
    if (nextParent.mode === 'page')
        return (
            nextParent.CMSVariableType &&
            (nextParent.CMSVariableType.indexOf('propagating_') >= 0 ||
                nextParent.CMSVariableType === 'array')
        )
    if (nextParent.text) return false
    if (nextParent.isElementFromCMSVariable) return false
    if (nextParent.isCMSVariable || nextParent.id === 'element_02')
        return node.isCMSVariable

    // if (nextParent.mode === 'template' && nextPath[0] !== prevPath[0])
    //     return false
    // || nextParent.id === 'element_02'

    switch (nextParent.itemPath[0]) {
        case 'trash':
            if (nextParent.id === 'trash') return true
            return false
        case 'element_02':
            return node.isCMSVariable
        default:
            if (node.isCMSVariable) return false
            if (
                prevParent.itemPath[0] === 'element_02' ||
                prevParent.id === 'element_02'
            )
                return false
            if (nextParent.isChildren) return false
            if (allModules.includes(nextParent.tag)) return false
            if (
                checkIfCapital(nextParent.tag.charAt(0)) &&
                nextParent.itemPath.length !== 0 &&
                !nextParent.forChildren
            )
                return false
            if (
                nextParent.mode === 'template' &&
                nextParent.itemPath.length === 0
            )
                return false
            return true
    }
}

export const canDragHandle = ({ node }) => {
    if (node.mode === 'page') {
        if (node.isPropagatingItem) return true
        return false
    }
    if (node.itemPath[0] === 'trash' && node.itemPath.length > 1) return false
    return (
        node.itemPath.length >
            (node.mode === 'template' &&
            node.itemPath[0] !== 'element_02' &&
            node.itemPath[0] !== 'trash'
                ? 1
                : 0) && !node.childrenFor
    )
}
