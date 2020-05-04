import { getInheritedPropertyName } from '../../../../utils/basic'

// import type Props from '../BuilderElement'
import camelCase from 'camelcase'
import styleToObject from 'style-to-object'

const styleToCamelcase = style => {
    const result = {}
    try {
        styleToObject(style, (name, value) => {
            result[camelCase(name)] = value
        })
    } catch (ex) {}

    return result
}

export const setBoxProperties = (
    ownRefinedProperties,
    props,
    elementValues
) => {
    const result = {}

    if (elementValues.style) {
        const style = elementValues.style.replace(
            /\$[A-Za-z0-9_-]*\$/g,
            match => {
                const inheritedPropertyName = getInheritedPropertyName(match)
                return inheritedPropertyName
                    ? props.parentPluginProps[inheritedPropertyName] || ''
                    : ''
            }
        )
        result.style = styleToCamelcase(style)
    }

    for (let attribute in ownRefinedProperties) {
        const attr = attribute.toLowerCase()
        switch (attr) {
            case 'style':
                break
            case '':
                break
            case 'class':
                result.className = ownRefinedProperties.class
                break
            case 'for':
                result.htmlFor = ownRefinedProperties.for
                break
            // case 'href':
            //     if (
            //         ownRefinedProperties[attr].indexOf('http://') > -1 ||
            //         ownRefinedProperties[attr].indexOf('https://') > -1
            //     ) {
            //         result.href = ownRefinedProperties[attr]
            //     } else {
            //         result.href = props.mD.baseUrl + ownRefinedProperties[attr]
            //     }
            //     break
            default:
                result[attr] = ownRefinedProperties[attr]
                break
        }
    }
    return result
}
// export const setBoxProperties = (
//     box: HTMLElement,
//     refinedProperties: {},
//     props: Props
// ) => {
//     while (box.attributes.length > 0)
//         box.removeAttribute(box.attributes[0].name)
//     if (props.elementValues.style) {
//         const style = props.elementValues.style.replace(
//             //eslint-disable-next-line
//             ///\$[^:;\$\s]*\$/g,
//             /\$[A-Za-z0-9_-]*\$/g,
//             match => {
//                 const inheritedPropertyName = getInheritedPropertyName(match)
//                 return inheritedPropertyName
//                     ? props.parentPluginProps[inheritedPropertyName] || ''
//                     : ''
//             }
//         )
//         box.setAttribute('style', style)
//     }

//     for (let attribute in refinedProperties) {
//         const attr = attribute.toLowerCase()
//         switch (attr) {
//             case 'style':
//                 break
//             case '':
//                 break
//             default:
//                 box.setAttribute(attr, refinedProperties[attr])
//                 break
//         }
//     }
// }

export const saveHoveredElementRect = (box, props) => {
    const rect = box.getBoundingClientRect()
    const iframe = document.getElementById('builderFrame')
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
