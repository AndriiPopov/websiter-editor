import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { isEqual, isEmpty } from 'lodash'
import Menu from '../Menu/Menu'

import * as actions from '../../../store/actions/index'
import { checkIfCapital } from '../../../utils/basic'
import type {
    pageStructureElementType,
    pageStructureType,
    filesStructureType,
    resourcesObjectsType,
} from '../../../../flowTypes'

type Props = {
    live?: boolean,
    element: pageStructureElementType,
    saveHoveredElementRect: Function,
    structure: pageStructureType,
    pluginsStructure: filesStructureType,
    resourcesObjects: resourcesObjectsType,
    document: {},
    pluginsPathArray: Array<{}>,
}

const _BuilderElement = (props: Props) => {
    const elementRef = useRef(null)

    useEffect(() => {
        const box = elementRef.current
        if (box) {
            while (box.attributes.length > 0)
                box.removeAttribute(box.attributes[0].name)
            if (props.element.style) {
                // $FlowFixMe
                elementRef.current.setAttribute('style', props.element.style)
            } else {
                // $FlowFixMe
                elementRef.current.removeAttribute('style')
            }

            for (let attribute in props.element.properties) {
                const attr = attribute.toLowerCase()
                switch (attr) {
                    case 'style':
                        break
                    default:
                        box.setAttribute(attr, props.element.properties[attr])
                        break
                }
            }
            const rect = elementRef.current.getBoundingClientRect()
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
    })

    const hoverBox = e => {
        if (props.findMode === 'page') {
            e.stopPropagation()
            props.hoverBox(props.routePlugin || props.element.id, 'page', true)
        } else if (props.findMode === 'plugin') {
            e.stopPropagation()
            if (props.sourcePlugin) {
                props.chooseResource(props.sourcePlugin, 'plugin')
                props.hoverBox(props.element.id, 'plugin', true)
            }
        }
    }

    const unhoverBox = e => {
        if (props.findMode) {
            e.stopPropagation()
            props.unhoverBox()
        }
    }

    const chooseBox = e => {
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
                const resourceDraft = props.resourcesObjects[props.sourcePlugin]
                    ? isEmpty(
                          props.resourcesObjects[props.sourcePlugin].present
                      )
                        ? props.resourcesObjects[props.sourcePlugin].draft
                        : props.resourcesObjects[props.sourcePlugin].present
                    : null
                props.chooseBox(
                    props.element.id,
                    props.sourcePlugin,
                    resourceDraft
                )
            }
        }
        props.toggleFindMode()
    }

    const currentPath = [...props.element.path, props.element.id]

    let Tag = props.element.tag || 'div'

    /* Tag = Tag.replace(/[^a-zA-Z]/g, '') */

    Tag = Tag.length > 0 ? Tag : 'div'

    if (checkIfCapital(Tag.charAt(0))) {
        const plugin = props.pluginsStructure.find(item => item.name === Tag)
        if (plugin) {
            if (!plugin.hidden) {
                const pluginResource = isEmpty(
                    props.resourcesObjects[plugin.id].present
                )
                    ? props.resourcesObjects[plugin.id].draft
                    : props.resourcesObjects[plugin.id].present

                return pluginResource.structure
                    .filter(itemInn =>
                        isEqual(itemInn.path, [
                            pluginResource.structure.filter(
                                item => item.path.length === 0
                            )[0].id,
                        ])
                    )
                    .map(itemInn => {
                        if (
                            props.pluginsPathArray.find(
                                item => item.plugin === plugin.id
                            )
                        ) {
                            return null
                        }
                        return (
                            <BuilderElement
                                key={itemInn.id}
                                structure={pluginResource.structure}
                                element={itemInn}
                                pluginsStructure={props.pluginsStructure}
                                resourcesObjects={props.resourcesObjects}
                                document={props.document}
                                sourcePlugin={plugin.id}
                                routePlugin={
                                    props.routePlugin || props.element.id
                                }
                                pluginsPathArray={[
                                    ...props.pluginsPathArray,
                                    {
                                        id: props.element.id,
                                        plugin: plugin.id,
                                    },
                                ]}
                                resourceDraft={props.resourceDraft}
                                currentResource={props.currentResource}
                                filesStructure={props.filesStructure}
                            />
                        )
                    })
            } else {
                return null
            }
        } else {
            return null
        }
    } else {
        if (Tag === 'menu') {
            return (
                <div
                    ref={elementRef}
                    onMouseEnter={e => hoverBox(e)}
                    onMouseMove={e => hoverBox(e)}
                    onMouseLeave={e => unhoverBox(e)}
                    onMouseDown={e => chooseBox(e)}
                >
                    <Menu element={props.element} document={props.document} />
                </div>
            )
        } else if (Tag === 'text') {
            return props.element.textContent
        } else if (Tag === 'style') {
            let fileContent = ''
            if (props.element.properties.name) {
                const file = props.filesStructure.find(
                    file => file.name === props.element.properties.name
                )
                if (file) {
                    if (!file.hidden) {
                        fileContent = props.resourcesObjects[file.id].value
                    }
                }
            }
            return <style ref={elementRef}>{fileContent}</style>
        } else {
            return (
                <Tag
                    ref={elementRef}
                    onMouseEnter={e => hoverBox(e)}
                    onMouseMove={e => hoverBox(e)}
                    onMouseLeave={e => unhoverBox(e)}
                    onMouseDown={e => chooseBox(e)}
                >
                    {Tag !== 'menu'
                        ? props.structure
                              .filter(item => isEqual(item.path, currentPath))
                              .map(item => (
                                  <BuilderElement
                                      key={item.id}
                                      live={props.live}
                                      structure={props.structure}
                                      element={item}
                                      pluginsStructure={props.pluginsStructure}
                                      resourcesObjects={props.resourcesObjects}
                                      document={props.document}
                                      pluginsPathArray={props.pluginsPathArray}
                                      sourcePlugin={props.sourcePlugin}
                                      routePlugin={props.routePlugin}
                                      resourceDraft={props.resourceDraft}
                                      currentResource={props.currentResource}
                                      filesStructure={props.filesStructure}
                                  />
                              ))
                        : null}
                </Tag>
            )
        }
    }
}

const mapStateToProps = (state, props) => {
    return { findMode: state.findMode }
}

const mapDispatchToProps = dispatch => {
    return {
        saveHoveredElementRect: (path, size) =>
            dispatch(actions.saveHoveredElementRect(path, size)),
        hoverBox: (id, currentResource, resourceDraft) =>
            dispatch(actions.hoverBox(id, currentResource, resourceDraft)),
        unhoverBox: () => dispatch(actions.unhoverBox()),
        chooseBox: (id, currentResource, resourceDraft) =>
            dispatch(actions.chooseBox(id, currentResource, resourceDraft)),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
        chooseResource: (id, type) =>
            dispatch(actions.chooseResource(id, type)),
    }
}

const BuilderElement = connect(
    mapStateToProps,
    mapDispatchToProps
)(_BuilderElement)

export default BuilderElement
