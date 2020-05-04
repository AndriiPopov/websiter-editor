import { checkIfCapital } from './basic'

export default (props, item, values, mode, isFromBuffer) => {
    if (props) {
        item = props.resourceDraftStructure.find(
            item => item.id === props.currentBox
        )
        if (item) values = props.resourceDraftValues[item.id]
        mode = props.mode
    }
    let currentBoxType
    if (item) {
        if (mode === 'page') {
            if (item.CMSVariableType) {
                currentBoxType =
                    item.CMSVariableType.indexOf('propagating_') >= 0
                        ? 'isFromPropagatingPlugin'
                        : 'isElementFromCMSVariable'
            } else {
                currentBoxType = 'isElementFromCMSVariable'
            }
        } else {
            if (item.path.length === 0 && !isFromBuffer) {
                if (item.id === 'trash') currentBoxType = 'trash'
                else if (item.id === 'element_02') currentBoxType = 'CMSRoute'
                else currentBoxType = 'html'
            } else if (
                item.path.length === 1 &&
                !isFromBuffer &&
                mode !== 'plugin'
            ) {
                currentBoxType = 'headBody'
            } else if (checkIfCapital(item.tag.charAt(0))) {
                currentBoxType = 'plugin'
            } else if (item.text) {
                currentBoxType = 'text'
            } else {
                currentBoxType = 'element'
            }
            if (item.isChildren) {
                currentBoxType = 'children'
            }
            if (item.childrenTo) {
                currentBoxType = 'childrenTo'
            }
            if (item.isCMSVariable) {
                currentBoxType = 'isCMSVariable'
            }
            if (item.isElementFromCMSVariable) {
                currentBoxType =
                    values.CMSVariableType.indexOf('propagating_') >= 0
                        ? 'isFromPropagatingPlugin'
                        : 'isElementFromCMSVariable'
            }
        }
    } else {
        currentBoxType = 'none'
    }
    return currentBoxType
}
