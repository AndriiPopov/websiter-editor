import {
    getCurrentResourceValue,
    checkIfCapital,
} from '../../../../utils/basic'

import type Props from '../BuilderElement'

export const hoverBox = (e: SyntheticMouseEvent<>, props: Props) => {
    e.stopPropagation()
    let Tag = props.element.tag || 'div'

    Tag = Tag.length > 0 ? Tag : 'div'
    // const isPlugin = checkIfCapital(Tag.charAt(0))
    const isPlugin = true
    if (props.findMode === 'page') {
        props.hoverBox(
            isPlugin ? props.routePlugin || props.element.id : props.element.id,
            'page',
            true
        )
    } else if (props.findMode === 'plugin') {
        if (props.sourcePlugin) {
            props.chooseResource(props.sourcePlugin, 'plugin')
            props.hoverBox(props.element.id, 'plugin', true)
        }
    }
}

export const unhoverBox = (e: SyntheticMouseEvent<>, props: Props) => {
    if (props.findMode) {
        e.stopPropagation()
        props.unhoverBox()
    }
}

export const chooseBox = (e: SyntheticMouseEvent<>, props: Props) => {
    if (props.findMode === 'page') {
        e.stopPropagation()
        props.chooseBox(
            props.routePlugin || props.element.id,
            props.currentResource,
            props.resourceDraft
        )
    } else if (props.findMode === 'plugin') {
        e.stopPropagation()
        if (props.sourcePlugin) {
            props.chooseResource(props.sourcePlugin, 'plugin')
            const resourceDraft = getCurrentResourceValue(
                props.sourcePlugin,
                props.resourcesObjects
            )
            if (resourceDraft)
                props.chooseBox(
                    props.element.id,
                    props.sourcePlugin,
                    resourceDraft
                )
        }
    }
    props.toggleFindMode()
}
