import React from 'react'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'

const HoveredBoxHighlight = props => {
    const iframe = document.getElementById('builderFrame')
    //const innerDoc = iframe.contentDocument || iframe.contentWindow.document
    if (!iframe) return null
    const scrollY = iframe.contentWindow.pageYOffset
    const scrollX = iframe.contentWindow.pageXOffset

    const result = []
    const parents = []
    const addHoverBoxes = parent => {
        if (!isEmpty(parent.children)) {
            for (const item in parent.children) {
                addHoverBoxes(parent.children[item])
            }
        } else {
            result.push(
                <div
                    key={result.length}
                    style={{
                        background: 'blue',
                        opacity: '.3',
                        position: 'fixed',
                        left: parent.left - scrollX + 'px',
                        top: parent.top - scrollY + 'px',
                        width: parent.width + 'px',
                        height: parent.height + 'px',
                        pointerEvents: 'none',
                        zIndex: '2147483647',
                    }}
                />
            )
        }
    }
    const findParents = children => {
        for (const item in children) {
            if (children[item].plugin === props.currentPlugin) {
                for (const innerItem in children[item].children) {
                    if (innerItem === props.hoveredElementId) {
                        parents.push(children[item].children[innerItem])
                    }
                }
            } else {
                findParents(children[item].children)
            }
        }
    }
    if (props.hoveredElementId) {
        if (props.hoverMode === 'page') {
            if (props.sizes[props.hoveredElementId]) {
                addHoverBoxes(props.sizes[props.hoveredElementId])
            }
        } else if (props.hoverMode === 'plugin') {
            findParents(props.sizes)
            parents.forEach(element => {
                addHoverBoxes(element)
            })
        }
    }
    return result
}

const mapStateToProps = state => {
    return {
        hoveredElementId: state.hoveredElementId,
        sizes: state.hoveredElementSize,
        hoverMode: state.hoverMode,
        currentPlugin: state.currentPlugin,
    }
}

export default connect(mapStateToProps)(HoveredBoxHighlight)
