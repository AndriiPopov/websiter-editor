import { getInheritedPropertyName } from '../../../../utils/basic'

import type Props from '../BuilderElement'

export const setBoxProperties = (
    box: HTMLElement,
    refinedProperties: {},
    props: Props
) => {
    while (box.attributes.length > 0)
        box.removeAttribute(box.attributes[0].name)
    if (props.element.style) {
        const style = props.element.style.replace(/\$[^:;\$\s]*\$/g, match => {
            const inheritedPropertyName = getInheritedPropertyName(match)
            return inheritedPropertyName
                ? props.parentPluginProps[inheritedPropertyName] || ''
                : ''
        })
        box.setAttribute('style', style)
    }

    for (let attribute in refinedProperties) {
        const attr = attribute.toLowerCase()
        switch (attr) {
            case 'style':
                break
            case '':
                break
            default:
                box.setAttribute(attr, refinedProperties[attr])
                break
        }
    }
}

export const saveHoveredElementRect = (box: HTMLElement, props: Props) => {
    const rect = box.getBoundingClientRect()
    const iframe = ((document.getElementById(
        'builderFrame'
    ): any): HTMLIFrameElement)
    const scrollY = iframe ? iframe.contentWindow.pageYOffset : 0
    const scrollX = iframe ? iframe.contentWindow.pageXOffset : 0

    props.saveHoveredElementRect(
        [
            ...props.pluginsPathArray,
            {
                id: props.element.id,
                plugin: null,
            },
        ],
        {
            left: rect.left + scrollX,
            top: rect.top + scrollY,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
        }
    )
}
