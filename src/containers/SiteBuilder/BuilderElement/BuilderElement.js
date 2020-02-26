import React, { useRef, useEffect, memo } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import Menu from '../Menu/Menu'
import { getCurrentResourceValue } from '../../../utils/basic'

import * as actions from '../../../store/actions/index'
import { checkIfCapital, getInheritedPropertyName } from '../../../utils/basic'

import { setBoxProperties } from './methods/useEffect'
import refineProperties from './methods/refineProperties'
import { hoverBox, unhoverBox, chooseBox } from './methods/boxMethods'
import { emptyTags, headTags } from './methods/tagsLibrary'
// import debounceRender from 'react-debounce-render'

import parse from 'html-react-parser'
import sanitize from 'sanitize-html'

import type {
    elementType,
    resourceType,
    initialStateType,
} from '../../../store/reducer/reducer'

export type Props = {
    element: elementType,
    saveHoveredElementRect: typeof actions.saveHoveredElementRect,
    structure: $PropertyType<resourceType, 'structure'>,
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
    toggleFindMode: typeof actions.toggleFindMode,
    childrenForPlugin: Array<elementType>,
    isHead?: boolean,
}

const _BuilderElement = (props: Props) => {
    const elementRef = useRef(null)

    useEffect(() => {
        const box = elementRef.current
        if (box) {
            if (Tag === 'script') {
                //$FlowFixMe
                const newScript = props.document.createElement(Tag)
                newScript.textContent = box.textContent
                setBoxProperties(newScript, refinedProperties, props)
                box.parentNode.appendChild(newScript)
                // box.parentNode.removeChild(box)
            } else {
                // saveHoveredElementRect(box, props)
                setBoxProperties(box, refinedProperties, props)
            }
        }
    })

    if (!props.elementValues) return null

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
                        document={props.document}
                        pluginsPathArray={props.pluginsPathArray}
                        sourcePlugin={childrenMainElement.sourcePlugin}
                        routePlugin={props.routePlugin}
                        parentPluginProps={props.parentPluginProps}
                        childrenForPlugin={props.childrenForPlugin}
                        currentResource={props.currentResource}
                    />
                ))
        }
        return null
    } else if (props.element.isElementFromCMSVariable) {
        const inheritedPropertyName = props.element.tag

        let parseText = ''
        if (inheritedPropertyName) {
            if (props.parentPluginProps[inheritedPropertyName]) {
                parseText = props.parentPluginProps[inheritedPropertyName]
            }
        }

        return parse(
            sanitize(parseText, {
                allowedTags: false,
                allowedAttributes: false,
            })
        )
    } else if (checkIfCapital(Tag.charAt(0))) {
        const plugin = props.pluginsStructure.find(item => item.name === Tag)
        if (plugin) {
            const childrenForPlugin = [
                ...props.structure.filter(itemInn =>
                    itemInn.path.includes(props.element.id)
                ),
                ...(props.childrenForPlugin ? props.childrenForPlugin : []),
            ]
            if (
                props.pluginsPathArray.find(
                    item => item.plugin === props.plugin.id
                )
            ) {
                return null
            }
            return (
                <PluginElement
                    pluginsStructure={props.pluginsStructure}
                    plugin={plugin}
                    tag={Tag}
                    document={props.document}
                    routePlugin={props.routePlugin || props.element.id}
                    pluginsPathArray={[
                        ...props.pluginsPathArray,
                        {
                            id: props.element.id,
                            plugin: plugin.id,
                        },
                    ]}
                    parentPluginProps={refinedProperties}
                    childrenForPlugin={childrenForPlugin}
                    currentResource={plugin.id}
                />
            )
        }
        return null
    } else if (!props.isHead || headTags.includes(Tag)) {
        if (Tag === 'websiterMenu') {
            return (
                <div
                    //$FlowFixMe
                    ref={elementRef}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                >
                    <Menu
                        element={props.element}
                        elementValues={props.elementValues}
                        document={props.document}
                        parentPluginProps={props.parentPluginProps}
                        childrenForPlugin={props.childrenForPlugin}
                    />
                </div>
            )
        } else if (Tag === 'richEditor') {
            return parse(
                sanitize(props.elementValues.textContent, {
                    allowedTags: false,
                    allowedAttributes: false,
                })
            )
        } else if (props.element.text) {
            if (props.elementValues.textContent) {
                return props.elementValues.textContent.replace(
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
                    {...omit(props.isHead ? refinedProperties : {}, [
                        'class',
                        'for',
                    ])}
                />
            ) : (
                <Tag
                    ref={elementRef}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                    {...omit(props.isHead ? refinedProperties : {}, [
                        'class',
                        'for',
                    ])}
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
                                      document={props.document}
                                      pluginsPathArray={props.pluginsPathArray}
                                      sourcePlugin={props.sourcePlugin}
                                      routePlugin={props.routePlugin}
                                      parentPluginProps={
                                          props.parentPluginProps
                                      }
                                      childrenForPlugin={
                                          props.childrenForPlugin
                                      }
                                      currentResource={props.currentResource}
                                  />
                              ))
                        : null}
                </Tag>
            )
        }
    } else {
        return null
    }
}

const mapStateToProps = (state, props) => {
    return {
        findMode: state.findMode,
        elementValues: getCurrentResourceValue(
            props.sourcePlugin || props.currentResource,
            state.resourcesObjects
        ).values[props.element.id],
        pluginsStructure: state.mD.pluginsStructure,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        saveHoveredElementRect: (path, size) =>
            dispatch(actions.saveHoveredElementRect(path, size)),
        hoverBox: (id, mode, fromFrame) =>
            dispatch(actions.hoverBox(id, mode, fromFrame)),
        unhoverBox: () => dispatch(actions.unhoverBox()),
        chooseBox: (id, currentResource) =>
            dispatch(actions.chooseBox(id, currentResource)),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
        chooseResource: (id, type, mD) =>
            dispatch(actions.chooseResource(id, type, mD)),
    }
}

const BuilderElement = connect(
    mapStateToProps,
    mapDispatchToProps
)(
    // debounceRender(
    memo(
        _BuilderElement,
        (prevProps, nextProps) =>
            isEqual(prevProps.elementValues, nextProps.elementValues) &&
            isEqual(prevProps.structure, nextProps.structure) &&
            isEqual(prevProps.parentPluginProps, nextProps.parentPluginProps)
    )
    // ,
    //     300
    // )
)

export default BuilderElement

const PluginElementRaw = props => {
    if (!props.plugin.hidden && props.pluginStructure) {
        //Pass children to plugin

        return props.pluginStructure
            .filter(itemInn =>
                isEqual(itemInn.path, [
                    props.pluginStructure.filter(
                        item => item.path.length === 0
                    )[0].id,
                ])
            )
            .map(itemInn => (
                <BuilderElement
                    key={itemInn.id}
                    structure={props.pluginStructure}
                    element={itemInn}
                    document={props.document}
                    sourcePlugin={props.plugin.id}
                    routePlugin={props.routePlugin}
                    pluginsPathArray={props.pluginsPathArray}
                    parentPluginProps={props.parentPluginProps}
                    childrenForPlugin={props.childrenForPlugin}
                    currentResource={props.currentResource}
                />
            ))
    }

    return null
}

const mapStateToPropsPlugin = (state, props) => {
    const plugin = getCurrentResourceValue(
        props.plugin.id,
        state.resourcesObjects
    )
    return {
        pluginStructure: plugin ? plugin.structure : [],
    }
}
//props.mD.resourcesObjects[plugin.id]
const PluginElement = connect(mapStateToPropsPlugin)(PluginElementRaw)
