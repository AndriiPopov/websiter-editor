import { checkIfCapital } from '../../../../utils/basic'

import type { Props } from '../ElementsTree'

export default (props: Props) => {
    const currentBox = props.resourceDraft.currentBox
    let currentItemInStructure = null
    if (currentBox) {
        currentItemInStructure = props.resourceDraft.structure.find(
            item => item.id === currentBox
        )
    }
    let currentBoxType: $PropertyType<Props, 'currentBoxType'>
    if (currentItemInStructure) {
        if (currentItemInStructure.path.length === 0) {
            currentBoxType = 'html'
        } else if (
            currentItemInStructure.path.length === 1 &&
            props.mode === 'page'
        ) {
            currentBoxType = 'headBody'
        } else if (checkIfCapital(currentItemInStructure.tag.charAt(0))) {
            currentBoxType = 'plugin'
        } else {
            currentBoxType = 'element'
        }
        if (currentItemInStructure.isChildren) {
            currentBoxType = 'children'
        }
        if (currentItemInStructure.childrenTo) {
            currentBoxType = 'childrenTo'
        }
    } else {
        currentBoxType = 'none'
    }
    return currentBoxType
}
