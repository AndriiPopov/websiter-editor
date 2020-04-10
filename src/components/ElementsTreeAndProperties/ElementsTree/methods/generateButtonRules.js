import type { Props } from '../ElementsTree'

export default (
    props: Props,
    currentBoxType: $PropertyType<Props, 'currentBoxType'>
) => {
    if (currentBoxType === 'trash') return {}
    const buttonRules = {}

    if (
        currentBoxType !== 'isCMSVariable' &&
        currentBoxType !== 'isElementFromCMSVariable' &&
        currentBoxType !== 'CMSRoute' &&
        currentBoxType !== 'isFromPropagatingPlugin'
    )
        buttonRules.addText = true

    if (
        currentBoxType !== 'CMSRoute' &&
        currentBoxType !== 'isFromPropagatingPlugin'
    )
        buttonRules.addFromCMSVariable = true

    if (
        ![
            'childrenTo',
            'isElementFromCMSVariable',
            'isFromPropagatingPlugin',
            'headBody',
            'html',
        ].includes(currentBoxType)
    )
        buttonRules.addNext = true

    if (props.mode === 'plugin') buttonRules.addChildren = true

    if (
        currentBoxType !== 'plugin' &&
        currentBoxType !== 'children' &&
        currentBoxType !== 'isElementFromCMSVariable' &&
        currentBoxType !== 'text'
    )
        buttonRules.addInside = true

    if (
        currentBoxType === 'element' ||
        currentBoxType === 'text' ||
        currentBoxType === 'plugin' ||
        currentBoxType === 'children'
    )
        buttonRules.duplicate = true

    if (currentBoxType === 'element' || currentBoxType === 'text')
        buttonRules.mergeToPlugin = true

    if (currentBoxType === 'element' || currentBoxType === 'headBody')
        buttonRules.mergeToPluginChildren = true

    if (currentBoxType === 'plugin') buttonRules.dissolve = true

    if (
        currentBoxType === 'element' ||
        currentBoxType === 'plugin' ||
        currentBoxType === 'children' ||
        // currentBoxType === 'isElementFromCMSVariable' ||
        currentBoxType === 'isCMSVariable' ||
        currentBoxType === 'text'
    )
        buttonRules.delete = true

    return buttonRules
}
