// import type Props from '../BuilderElement'

export const hoverBox = (e, props) => {
    e.stopPropagation()
    // let Tag = props.element.tag || 'div'

    // Tag = Tag.length > 0 ? Tag : 'div'
    // const isPlugin = checkIfCapital(Tag.charAt(0))
    // const isPlugin = true
    if (props.findMode === 'page') {
        props.hoverBox(
            // isPlugin ?
            props.routePlugin || props.element.id,
            //  : props.element.id,
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

export const unhoverBox = (e, props) => {
    if (props.findMode) {
        e.stopPropagation()
        props.unhoverBox()
    }
}

export const chooseBox = (e, props) => {
    if (props.findMode === 'page') {
        e.stopPropagation()
        props.chooseBox(
            props.findMode, /// not sure
            props.routePlugin || props.element.id
        )
    } else if (props.findMode === 'plugin') {
        e.stopPropagation()
        if (props.sourcePlugin) {
            props.chooseResource(props.sourcePlugin, 'plugin')

            props.chooseBox(
                props.findMode, /// not sure
                props.element.id
            )
        }
    }
    props.toggleFindMode()
}
