import React, { useRef, useEffect, memo } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import omit from 'lodash/omit'
import Menu from '../Menu/Menu'
import Drawer from '../Drawer/Drawer'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

import { getCurrentResourceValue } from '../../../utils/basic'

import * as actions from '../../../store/actions/index'
import { checkIfCapital, getInheritedPropertyName } from '../../../utils/basic'

import { setBoxProperties } from './methods/useEffect'
import refineProperties from './methods/refineProperties'
import { hoverBox, unhoverBox, chooseBox } from './methods/boxMethods'
import { emptyTags, headTags } from './methods/tagsLibrary'

import parse from 'html-react-parser'
import sanitize from 'sanitize-html'

import { modulesPropertyNodes } from '../../../utils/modulesIndex'
// import type {
//     elementType,
//     resourceType,
//     initialStateType,
// } from '../../../store/reducer/reducer'

// export type Props = {
//     element,
//     saveHoveredElementRect: typeof actions.saveHoveredElementRect,
//     structure: $PropertyType<resourceType, 'structure'>,
//     document: {},
//     pluginsPathArray: Array<{
//         id: string,
//         plugin: string,
//     }>,
//     findMode: $PropertyType<initialStateType, 'findMode'>,
//     parentPluginProps: $PropertyType<elementType, 'properties'>,
//     sourcePlugin: string,
//     routePlugin: string,
//     hoverBox: typeof actions.hoverBox,
//     chooseResource: typeof actions.chooseResource,
//     unhoverBox: typeof actions.unhoverBox,
//     chooseBox: typeof actions.chooseBox,
//     toggleFindMode: typeof actions.toggleFindMode,
//     childrenForPlugin: Array<elementType>,
//     isHead?: boolean,
// }

const _BuilderElement = props => {
    const elementRef = useRef(null)

    useEffect(() => {
        const box = elementRef.current
        if (box && ownRefinedProperties) {
            if (Tag === 'script') {
                const newScript = props.document.createElement(Tag)
                newScript.textContent = box.textContent
                // setBoxProperties(newScript, ownRefinedProperties, props)
                box.parentNode.appendChild(newScript)

                // box.parentNode.removeChild(box)
            } else {
                // saveHoveredElementRect(box, props)
                // setBoxProperties(box, ownRefinedProperties, props)
            }
        }
    })

    if (!props.elementValues) {
        return null
    }

    const { refinedProperties, ownRefinedProperties } = refineProperties(props)
    const attributes = setBoxProperties(
        ownRefinedProperties,
        props,
        props.elementValues
    )
    const currentPath = [...props.element.path, props.element.id]

    let Tag = props.element.tag || 'div'

    Tag = Tag.length > 0 ? Tag : 'div'
    const getModulePropertiesNodes = tag => {
        const nodes = {}
        const possibleNodes = modulesPropertyNodes[tag] || []
        for (let el of possibleNodes) {
            const nodeItem = props.structure.find(
                item =>
                    item.forModule === props.element.id &&
                    item.childrenTo === el.id
            )
            let node
            if (nodeItem) {
                node = props.structure
                    .filter(item =>
                        isEqual(item.path, [...nodeItem.path, nodeItem.id])
                    )
                    .map(item => (
                        <BuilderElement
                            key={item.id}
                            structure={props.structure.filter(itemInn =>
                                itemInn.path.includes(item.id)
                            )}
                            element={item}
                            document={props.document}
                            pluginsPathArray={props.pluginsPathArray}
                            sourcePlugin={props.sourcePlugin}
                            routePlugin={props.routePlugin}
                            parentPluginProps={props.parentPluginProps}
                            childrenForPlugin={props.childrenForPlugin}
                            currentResource={props.currentResource}
                        />
                    ))
            }
            if (node) nodes[el.id] = node
        }
        return nodes
    }
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
                        currentResource={item.fromResource}
                        isHead={props.isHead}
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
        const plugin = props.pluginsStructure.find(
            item => item.name === Tag && !item.hidden
        )
        if (plugin) {
            const childrenForPlugin = [
                ...props.structure
                    .filter(itemInn => itemInn.path.includes(props.element.id))
                    .map(itemInn => ({
                        ...itemInn,
                        fromResource: props.currentResource,
                    })),
                ...(props.childrenForPlugin ? props.childrenForPlugin : []),
            ]
            if (
                props.pluginsPathArray.find(item => item.plugin === plugin.id)
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
                    isHead={props.isHead}
                />
            )
        }
        return null
    } else if (!props.isHead || headTags.includes(Tag)) {
        if (Tag === 'websiterMenu') {
            return (
                <div
                    {...attributes}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                >
                    <Menu
                        element={props.element}
                        elementValues={props.elementValues}
                        refinedProperties={refinedProperties}
                        document={props.document}
                        parentPluginProps={props.parentPluginProps}
                        childrenForPlugin={props.childrenForPlugin}
                        {...getModulePropertiesNodes(Tag)}
                    />
                </div>
            )
        } else if (Tag === 'websiterDrawer') {
            return (
                <div
                    {...attributes}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                >
                    <Drawer
                        element={props.element}
                        refinedProperties={refinedProperties}
                        document={props.document}
                        parentPluginProps={props.parentPluginProps}
                        childrenForPlugin={props.childrenForPlugin}
                        {...getModulePropertiesNodes(Tag)}
                    />
                </div>
            )
        } else if (Tag === 'websiterGallery') {
            let items = refinedProperties.items || []
            if (refinedProperties.originalClass) {
                items = items.map(item => ({
                    ...item,
                    originalClass: refinedProperties.originalClass,
                }))
            }
            const settings = {
                dots: true,
                infinite: true,
                speed: 500,
                slidesToShow: 1,
                slidesToScroll: 1,
            }
            return (
                <div
                    {...attributes}
                    onMouseEnter={e => hoverBox(e, props)}
                    onMouseMove={e => hoverBox(e, props)}
                    onMouseLeave={e => unhoverBox(e, props)}
                    onMouseDown={e => chooseBox(e, props)}
                >
                    <Slider
                        // element={props.element}
                        // elementValues={props.elementValues}
                        // document={props.document}
                        // parentPluginProps={props.parentPluginProps}
                        // childrenForPlugin={props.childrenForPlugin}
                        {...settings}
                        {...refinedProperties}
                        {...getModulePropertiesNodes(Tag)}
                    >
                        <div>
                            <div
                                style={{
                                    width: '100px',
                                    height: '100px',
                                    background: 'red',
                                }}
                            >
                                sdfsdf
                            </div>
                        </div>
                        {props.currentWebsiteObject && props.filesStructure
                            ? items.map(item => {
                                  return (
                                      <div>
                                          <img src={item.original} />
                                      </div>
                                  )
                              })
                            : null}
                    </Slider>
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
            // Tag = Tag.replace(/[^a-z]/g, '')
            // Tag = Tag.trim()
            Tag = Tag.trim()

            if (/^([a-zA-Z][a-zA-Z0-9]*)$/.test(Tag)) {
                return emptyTags.includes(Tag) ? (
                    <Tag
                        {...attributes}
                        onMouseEnter={e => hoverBox(e, props)}
                        onMouseMove={e => hoverBox(e, props)}
                        onMouseLeave={e => unhoverBox(e, props)}
                        onMouseDown={e => chooseBox(e, props)}
                        {...omit(props.isHead ? ownRefinedProperties : {}, [
                            'class',
                            'for',
                        ])}
                    />
                ) : (
                    <Tag
                        {...attributes}
                        onMouseEnter={e => hoverBox(e, props)}
                        onMouseMove={e => hoverBox(e, props)}
                        onMouseLeave={e => unhoverBox(e, props)}
                        onMouseDown={e => chooseBox(e, props)}
                        {...omit(props.isHead ? ownRefinedProperties : {}, [
                            'class',
                            'for',
                        ])}
                    >
                        {Tag !== 'menu'
                            ? props.structure
                                  .filter(item =>
                                      isEqual(item.path, currentPath)
                                  )
                                  .map(item => (
                                      <BuilderElement
                                          key={item.id}
                                          structure={props.structure.filter(
                                              itemInn =>
                                                  itemInn.path.includes(item.id)
                                          )}
                                          element={item}
                                          document={props.document}
                                          pluginsPathArray={
                                              props.pluginsPathArray
                                          }
                                          sourcePlugin={props.sourcePlugin}
                                          routePlugin={props.routePlugin}
                                          parentPluginProps={
                                              props.parentPluginProps
                                          }
                                          childrenForPlugin={
                                              props.childrenForPlugin
                                          }
                                          currentResource={
                                              props.currentResource
                                          }
                                      />
                                  ))
                            : null}
                    </Tag>
                )
            }
            return null
        }
    } else {
        return null
    }
}

const mapStateToProps = (state, props) => {
    const sourceResource = props.sourcePlugin || props.currentResource

    let elementValues
    if (sourceResource)
        elementValues = getCurrentResourceValue(
            sourceResource,
            state.resourcesObjects
        ).values[props.element.id]

    return {
        findMode: state.findMode,
        elementValues,
        pluginsStructure: state.mD.pluginsStructure,
        currentWebsiteObject: state.mD.currentWebsiteObject,
        filesStructure: state.mD.filesStructure,
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
        (prevProps, nextProps) => isEqual(prevProps, nextProps)
        //  &&
        // isEqual(prevProps.structure, nextProps.structure) &&
        // isEqual(prevProps.parentPluginProps, nextProps.parentPluginProps)
    )
    // ,
    //     300
    // )
)

export default BuilderElement

const PluginElementRaw = props => {
    console.log(props.parentPluginProps)
    if (!props.plugin.hidden && props.pluginStructure) {
        //Pass children to plugin
        if (props.plugin.propagating) {
            return Array.isArray(props.parentPluginProps.items)
                ? props.parentPluginProps.items.map(item =>
                      props.pluginStructure
                          .filter(itemInn =>
                              isEqual(itemInn.path, ['element_0'])
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
                                  parentPluginProps={{
                                      ...props.parentPluginProps,
                                      ...item,
                                  }}
                                  childrenForPlugin={props.childrenForPlugin}
                                  currentResource={props.currentResource}
                                  isHead={props.isHead}
                              />
                          ))
                  )
                : null
        } else {
            return props.pluginStructure
                .filter(itemInn => isEqual(itemInn.path, ['element_0']))
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
                        isHead={props.isHead}
                    />
                ))
        }
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
