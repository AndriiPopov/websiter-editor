import React from 'react'

// type Props = {
//     className?: string,
//     icon: ?string,
//     datatestid?: string,
// }

// type Element = {
//     type: string,
//     children: Array<Element>,
//     fill: string,
//     d: string,
// }

export const Svg = props => {
    const svgStringToObj = svg => {
        const obj = []

        const stack = []

        while (svg.length > 0) {
            svg = svg.trim()
            if (svg.indexOf('</') === 0) {
                svg = svg.substring(2)
                if (svg.indexOf('<') > 0) {
                    svg = svg.substring(svg.indexOf('<'))
                    stack.pop()
                } else {
                    svg = ''
                }
            } else {
                svg = svg.substring(svg.indexOf('<'))
                const curObj = {
                    type: svg.substring(1, svg.indexOf(' ')),
                    children: [],
                }
                svg = svg.substring(svg.indexOf(' '))
                let attr = svg.substring(0, svg.indexOf('>'))
                let selfclosing = attr.indexOf('/>') >= 0

                svg = svg.substring(svg.indexOf('>') + 1).trim()
                while (attr.length > 0) {
                    let key = attr.substring(0, attr.indexOf('=')).trim()
                    attr = attr.substring(attr.indexOf('"') + 1)
                    let value = attr.substring(0, attr.indexOf('"')).trim()
                    attr = attr.substring(attr.indexOf('"') + 1).trim()
                    curObj[key] = value
                }
                if (stack.length === 0) {
                    obj.push(curObj)
                } else {
                    stack[stack.length - 1].children.push(curObj)
                }
                if (!selfclosing) {
                    stack.push(curObj)
                }
            }
        }
        return obj[0]
    }

    const svgChildrenToElements = (element, elementIndex) => {
        switch (element.type) {
            case 'path':
                return (
                    <path key={elementIndex} d={element.d} fill={element.fill}>
                        {element.children.map((el: Element, index) =>
                            svgChildrenToElements(el, index)
                        )}
                    </path>
                )
            case 'g':
                return (
                    <g key={elementIndex} fill={element.fill}>
                        {element.children.map((el: Element, index) =>
                            svgChildrenToElements(el, index)
                        )}
                    </g>
                )
            default:
                return
        }
    }

    let result = null
    if (props.icon) {
        const objectSvg = svgStringToObj(props.icon)

        result = (
            <svg
                data-testid={props.datatestid || 'svg'}
                height={objectSvg.height}
                width={objectSvg.width}
                viewBox={objectSvg.viewBox}
                className={props.className}
            >
                {objectSvg.children.map((element, index) =>
                    svgChildrenToElements(element, index)
                )}
            </svg>
        )
    }
    return result
}

export default Svg
