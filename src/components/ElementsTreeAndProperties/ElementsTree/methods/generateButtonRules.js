import type { Props } from '../ElementsTree'

export default (
    props: Props,
    currentBoxType: $PropertyType<Props, 'currentBoxType'>
) => {
    const buttonRules = {}

    if (
        currentBoxType !== 'isCMSVariable' &&
        currentBoxType !== 'isElementFromCMSVariable'
    )
        buttonRules.addText = true

    if (currentBoxType !== 'childrenTo') buttonRules.addNext = true

    if (props.mode === 'plugin') buttonRules.addChildren = true

    if (
        currentBoxType !== 'plugin' &&
        currentBoxType !== 'children' &&
        currentBoxType !== 'isElementFromCMSVariable'
    )
        buttonRules.addInside = true

    if (
        currentBoxType === 'element' ||
        currentBoxType === 'plugin' ||
        currentBoxType === 'children'
    )
        buttonRules.duplicate = true

    if (currentBoxType === 'element') buttonRules.mergeToPlugin = true

    if (currentBoxType === 'element' || currentBoxType === 'headBody')
        buttonRules.mergeToPluginChildren = true

    if (currentBoxType === 'plugin') buttonRules.dissolve = true

    if (
        currentBoxType === 'element' ||
        currentBoxType === 'plugin' ||
        currentBoxType === 'children' ||
        currentBoxType === 'isElementFromCMSVariable' ||
        currentBoxType === 'isCMSVariable'
    )
        buttonRules.delete = true

    return buttonRules
}
