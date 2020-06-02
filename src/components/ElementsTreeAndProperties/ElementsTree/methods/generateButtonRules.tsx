// import type { Props } from '../ElementsTree'

export default (props: { mode: string }, currentBoxType: string) => {
    let buttonRules = { addChildren: false }
    if (props.mode === 'plugin') buttonRules.addChildren = true
    switch (currentBoxType) {
        case 'trash':
            return {
                ...buttonRules,
                deleteChildren: true,
            }
        case 'isCMSVariable':
            return {
                ...buttonRules,
                addNext: true,
                addInside: true,
                duplicate: true,
                delete: true,
                deleteChildren: true,
            }
        case 'isElementFromCMSVariable':
            return {
                ...buttonRules,
                addNext: true,
                addFromCMSVariable: true,
                duplicate: true,
                delete: true,
            }
        case 'isFromPropagatingPlugin':
            return {
                ...buttonRules,
            }
        case 'CMSRoute':
            return {
                ...buttonRules,
                addInside: true,
                deleteChildren: true,
            }
        case 'html':
            return {
                ...buttonRules,
                addText: true,
                addFromCMSVariable: true,
                addInside: true,
            }
        case 'headBody':
            return {
                ...buttonRules,
                addText: true,
                addFromCMSVariable: true,
                addInside: true,
                mergeToPluginChildren: true,
                deleteChildren: true,
            }
        case 'plugin':
            return {
                ...buttonRules,
                addNext: true,
                delete: true,
                duplicate: true,
                addFromCMSVariable: true,
                dissolve: true,
            }
        case 'text':
            return {
                ...buttonRules,
                addNext: true,
                delete: true,
                duplicate: true,
                addFromCMSVariable: true,
                mergeToPlugin: true,
            }
        case 'element':
            return {
                ...buttonRules,
                addNext: true,
                addInside: true,
                delete: true,
                deleteChildren: true,
                duplicate: true,
                addFromCMSVariable: true,
                mergeToPlugin: true,
                mergeToPluginChildren: true,
            }
        case 'children':
            return {
                ...buttonRules,
                addNext: true,
                delete: true,
                deleteChildren: true,
                duplicate: true,
                addFromCMSVariable: true,
            }
        case 'childrenTo':
            return {
                ...buttonRules,
                addInside: true,
                addFromCMSVariable: true,
                addText: true,
                mergeToPluginChildren: true,
            }
        case 'isFromPropagatingPlugin':
            return {
                ...buttonRules,
                addInside: true,
            }
        default:
            return {
                ...buttonRules,
            }
    }
}
