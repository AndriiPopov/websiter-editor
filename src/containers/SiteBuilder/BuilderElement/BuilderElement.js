import React, { useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { isEqual, isEmpty, omit } from 'lodash'
import Menu from '../Menu/Menu'

import * as actions from '../../../store/actions/index'
import {
    getCurrentResourceValue,
    checkIfCapital,
    getInheritedPropertyName,
} from '../../../utils/basic'

import { setBoxProperties, saveHoveredElementRect } from './methods/useEffect'
import refineProperties from './methods/refineProperties'
import { hoverBox, unhoverBox, chooseBox } from './methods/boxMethods'
import { emptyTags, headTags } from './methods/tagsLibrary'

import type {
    elementType,
    resourceType,
    initialStateType,
    pageType,
} from '../../../store/reducer/reducer'

export type Props = {
    element: elementType,
    saveHoveredElementRect: typeof actions.saveHoveredElementRect,
    structure: $PropertyType<resourceType, 'structure'>,
    pluginsStructure: $PropertyType<initialStateType, 'pluginsStructure'>,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
    document: {},
    pluginsPathArray: Array<{
        id: string,
        plugin: string,
    }>,
    findMode: $PropertyType<initialStateType, 'findMode'>,
    parentPluginProps: $PropertyType<elementType, 'properties'>,
    sourcePlugin: string,
    routePlugin: string,
    hoverBox: typeof actions.hoverBox,
    chooseResource: typeof actions.chooseResource,
    unhoverBox: typeof actions.unhoverBox,
    chooseBox: typeof actions.chooseBox,
    currentResource: string,
    resourceDraft: resourceType,
    toggleFindMode: typeof actions.toggleFindMode,
    childrenForPlugin: Array<elementType>,
    pageInStructure: pageType,
}

const _BuilderElement = (props: Props) => {
    const elementRef = useRef(null)

    useEffect(() => {
        const box = elementRef.current
        if (box) {
            setBoxProperties(box, refinedProperties, props)
            saveHoveredElementRect(box, props)
        }
    })

    const refinedProperties = refineProperties(props)

    const currentPath = [...props.element.path, props.element.id]

    let Tag = props.element.tag || 'div'

    Tag = Tag.length > 0 ? Tag : 'div'

    if (props.element.childrenTo) {
        return null
    } else if (props.element.isChildren) {
        const childrenMainElement = props.childrenForPlugin.find(
            itemInn =>
                itemInn.childrenTo === props.element.id &&
                itemInn.forPlugin === props.sourcePlugin
        )

        if (childrenMainElement) {
            const newStructure = props.childrenForPlugin.filter(itemInn =>
                itemInn.path.includes(childrenMainElement.id)
            )

            return newStructure
                .filter(itemInn => {
                    if (itemInn.path.length > 0) {
                        if (
                            itemInn.path[itemInn.path.length - 1] ===
                            childrenMainElement.id
                        )
                            return true
                    }
                    return false
                })
                .map(item => (
                    <BuilderElement
                        key={item.id}
                        structure={newStructure}
                        element={item}
                        pluginsStructure={props.pluginsStructure}
                        resourcesObjects={props.resourcesObjects}
                        document={props.document}
                        pluginsPathArray={props.pluginsPathArray}
                        sourcePlugin={childrenMainElement.sourcePlugin}
                        routePlugin={props.routePlugin}
                        resourceDraft={props.resourceDraft}
                        currentResource={props.currentResource}
                        parentPluginProps={props.parentPluginProps}
                        childrenForPlugin={props.childrenForPlugin}
                        pageInStructure={props.pageInStructure}
                    />
                ))
        }
        return null
    } else if (checkIfCapital(Tag.charAt(0))) {
        const plugin = props.pluginsStructure.find(item => item.name === Tag)
        if (plugin) {
            if (!plugin.hidden) {
                const pluginResource = isEmpty(
                    props.resourcesObjects[plugin.id].present
                )
                    ? props.resourcesObjects[plugin.id].draft
                    : props.resourcesObjects[plugin.id].present

                //Pass children to plugin
                const childrenForPlugin = [
                    ...props.structure.filter(itemInn =>
                        itemInn.path.includes(props.element.id)
                    ),
                    ...(props.childrenForPlugin ? props.childrenForPlugin : []),
                ]

                if (!pluginResource.structure) return

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
                                parentPluginProps={refinedProperties}
                                childrenForPlugin={childrenForPlugin}
                                pageInStructure={props.pageInStructure}
                            />
                        )
                    })
            }
        }
        return null
    } else if (!props.isHead || headTags.includes(Tag)) {
        if (Tag === 'websiterMenu') {
            return (
                <div
                    ref={elementRef}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                >
                    <Menu
                        element={props.element}
                        document={props.document}
                        parentPluginProps={props.parentPluginProps}
                        childrenForPlugin={props.childrenForPlugin}
                        pageInStructure={props.pageInStructure}
                    />
                </div>
            )
        } else if (Tag === 'text') {
            if (props.element.textContent) {
                return props.element.textContent.replace(
                    // /\$[^:;\$\s]*\$/g,
                    /\$[A-Za-z0-9]*\$/g,
                    match => {
                        const inheritedPropertyName = getInheritedPropertyName(
                            match
                        )
                        return inheritedPropertyName
                            ? props.parentPluginProps[inheritedPropertyName] ||
                                  ''
                            : ''
                    }
                )
            } else {
                return props.isHead ? '' : null
            }
        } else {
            return emptyTags.includes(Tag) ? (
                <Tag
                    ref={elementRef}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                />
            ) : (
                <Tag
                    ref={elementRef}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                >
                    {Tag !== 'menu'
                        ? props.structure
                              .filter(item => isEqual(item.path, currentPath))
                              .map(item => (
                                  <BuilderElement
                                      key={item.id}
                                      structure={props.structure.filter(
                                          itemInn =>
                                              itemInn.path.includes(item.id)
                                      )}
                                      element={item}
                                      pluginsStructure={props.pluginsStructure}
                                      resourcesObjects={props.resourcesObjects}
                                      document={props.document}
                                      pluginsPathArray={props.pluginsPathArray}
                                      sourcePlugin={props.sourcePlugin}
                                      routePlugin={props.routePlugin}
                                      resourceDraft={props.resourceDraft}
                                      currentResource={props.currentResource}
                                      parentPluginProps={
                                          props.parentPluginProps
                                      }
                                      childrenForPlugin={
                                          props.childrenForPlugin
                                      }
                                      pageInStructure={props.pageInStructure}
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
        hoverBox: (id, mode, fromFrame) =>
            dispatch(actions.hoverBox(id, mode, fromFrame)),
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
