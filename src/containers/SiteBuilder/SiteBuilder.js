import React, { Component } from 'react'
import { connect } from 'react-redux'
import { omit, isEqual, isEmpty, cloneDeep } from 'lodash'

import * as classes from './SiteBuilder.module.css'
import * as actions from '../../store/actions/index'
import Frame, { FrameContextConsumer } from './Frame/index'
import SiteBuilderLayout from '../../components/SiteBuilderLayout/SiteBuilderLayout'
import BuilderElement from './BuilderElement/BuilderElement'
import HoveredBoxHighlight from './HoveredBoxHighlight/HoveredBoxHighlight'
import { systemClassMenu } from './systemClasses'
import type {
    pageStructureType,
    filesStructureType,
    resourcesObjectsType,
} from '../../../flowTypes'
import { Beforeunload } from 'react-beforeunload'
import ReactResizeDetector from 'react-resize-detector'

type Props = {
    zoom: number,
    currentPage: string,
    resourcesObjects: {},
    structure: pageStructureType,
    filesStructure: filesStructureType,
    resourcesObjects: resourcesObjectsType,
    pluginsStructure: filesStructureType,
    resourcesObjects: resourcesObjectsType,
    hoveredElementId: string,
    markRefreshing: Function,
    isRefreshing: boolean,
    sizeIsChanging: boolean,
    notSavedResources: Array<string>,
    saveBarSizes: Function,
    changeBarSize: Function,
    barSizes: {},
}

type State = {
    head: any,
}

class SiteBuilder extends Component<Props, State> {
    state = {
        head: [],
    }

    componentDidMount() {
        const iframe = document.getElementById('builderFrame')
        const innerDoc = iframe.contentDocument || iframe.contentWindow.document
        const rect = innerDoc.body.getBoundingClientRect()
        this.props.saveHoveredElementRect([{ id: 'element_1' }], {
            left: rect.left,
            top: rect.top,
            width: rect.right - rect.left,
            height: rect.bottom - rect.top,
        })
        // if (
        //     this.props.currentPage &&
        //     this.props.resourcesObjects &&
        //     this.props.pageStructure.length === 0
        // ) {
        //     this.props.loadCurrentPageToBuilder(
        //         this.props.currentPage,
        //         this.props.resourcesObjects
        //     )
        // }
    }
    head = ''

    componentWillReceiveProps(newProps) {
        const structure =
            newProps.resourcesObjects[newProps.currentPage].present.structure ||
            newProps.resourcesObjects[newProps.currentPage].draft.structure
        if (structure) {
            const getHead = () => {
                return structure
                    ? structure
                          .filter(item => item.path.length === 1)
                          .map((item, index) => {
                              if (index === 0)
                                  return structure
                                      .filter(itemInn =>
                                          isEqual(itemInn.path, [item.id])
                                      )
                                      .map(itemInn => {
                                          let Tag = itemInn.tag || 'link'
                                          Tag = Tag.replace(/[^a-zA-Z]/g, '')
                                          Tag = Tag.length > 0 ? Tag : 'link'
                                          const properties = omit(
                                              itemInn.properties,
                                              ['style']
                                          )
                                          let propertiesString = ''
                                          for (let attr in properties)
                                              propertiesString +=
                                                  attr +
                                                  ' ="' +
                                                  properties[attr] +
                                                  '" '
                                          let fileContent = ''

                                          if (Tag === 'style') {
                                              if (properties.name) {
                                                  const file = newProps.filesStructure.find(
                                                      file =>
                                                          file.name ===
                                                          properties.name
                                                  )
                                                  if (file) {
                                                      if (!file.hidden) {
                                                          fileContent =
                                                              newProps
                                                                  .resourcesObjects[
                                                                  file.id
                                                              ].value
                                                      }
                                                  }
                                              }
                                              return `<style ${propertiesString}>${fileContent}</style>`
                                          }

                                          return `<${Tag} ${propertiesString} />`
                                      })
                              return ''
                          })
                          .join(' ')
                    : ''
            }

            const newHead = getHead()

            if (JSON.stringify(newHead) !== this.state.head) {
                this.head = newHead.slice(0)
                this.props.markRefreshing(true)

                this.setState({ head: JSON.stringify(this.head) })
            }
        }
    }

    checkOnLeave = e => {
        this.props.saveBarSizes(this.props.barSizes)
        if (this.props.notSavedResources.length > 0)
            return 'Some data is not saved.'
        else return undefined
    }

    render() {
        const resourceDraft = this.props.currentPage
            ? this.props.resourcesObjects[this.props.currentPage]
                ? isEmpty(
                      this.props.resourcesObjects[this.props.currentPage]
                          .present
                  )
                    ? this.props.resourcesObjects[this.props.currentPage].draft
                    : this.props.resourcesObjects[this.props.currentPage]
                          .present
                : null
            : null
        const { props } = this
        const zoom = props.zoom / 100
        const size = 100 / zoom + '%'
        const structure =
            props.resourcesObjects[props.currentPage].present.structure ||
            props.resourcesObjects[props.currentPage].draft.structure

        const bodyElement = structure.filter(item => item.path.length === 1)[1]
        const bodyProps = cloneDeep(bodyElement.properties)
        const bodyStyle = bodyElement.style
        if (bodyStyle) bodyProps.style = bodyStyle

        const htmlElement = structure.filter(item => item.path.length === 0)[1]
        const htmlProps = cloneDeep(htmlElement.properties)
        const htmlStyle = htmlElement.style
        if (htmlStyle) htmlProps.style = htmlStyle

        return (
            <Beforeunload onBeforeunload={e => this.checkOnLeave(e)}>
                <ReactResizeDetector
                    handleWidth
                    handleHeight
                    onResize={() =>
                        this.props.changeBarSize(this.props.barSizes)
                    }
                />
                <SiteBuilderLayout>
                    {this.props.isRefreshing ? (
                        <StopRefresh />
                    ) : (
                        <>
                            <Frame
                                id="builderFrame"
                                key={1}
                                style={{
                                    width: size,
                                    height: size,
                                    msZoom: zoom,
                                    MozTransform: `scale(${zoom})`,
                                    MozTransformOrigin: '0 0',
                                    OTransform: `scale(${zoom})`,
                                    OTransformOrigin: '0 0',
                                    WebkitTransform: `scale(${zoom})`,
                                    WebkitTransformOrigin: '0 0',
                                    border: 'none',
                                    margin: '0',
                                    padding: '0',
                                }}
                                bodyProps={bodyProps}
                                htmlProps={htmlProps}
                                initialContent={`<!DOCTYPE html><html><head>${systemClassMenu} ${
                                    this.head
                                }</head><body></body></html>`}
                            >
                                <FrameContextConsumer>
                                    {({ document, window }) => {
                                        return structure
                                            ? structure
                                                  .filter(itemInn =>
                                                      isEqual(itemInn.path, [
                                                          structure.filter(
                                                              item =>
                                                                  item.path
                                                                      .length ===
                                                                  1
                                                          )[1].id,
                                                      ])
                                                  )
                                                  .map(itemInn => (
                                                      <BuilderElement
                                                          key={itemInn.id}
                                                          structure={structure}
                                                          element={itemInn}
                                                          hoveredElementId={
                                                              props.hoveredElementId
                                                          }
                                                          pluginsStructure={
                                                              props.pluginsStructure
                                                          }
                                                          resourcesObjects={
                                                              props.resourcesObjects
                                                          }
                                                          document={document}
                                                          pluginsPathArray={[]}
                                                          resourceDraft={
                                                              resourceDraft
                                                          }
                                                          currentResource={
                                                              this.props
                                                                  .currentPage
                                                          }
                                                          filesStructure={
                                                              this.props
                                                                  .filesStructure
                                                          }
                                                      />
                                                  ))
                                            : null
                                    }}
                                </FrameContextConsumer>
                                <HoveredBoxHighlight />
                            </Frame>
                        </>
                    )}
                    {this.props.sizeIsChanging ? (
                        <div className={classes.Overlay} />
                    ) : null}
                </SiteBuilderLayout>
            </Beforeunload>
        )
    }
}

const mapStateToProps = state => {
    return {
        zoom: state.pageZoom,
        currentPage: state.currentPage,
        resourcesObjects: state.resourcesObjects,
        filesStructure: state.filesStructure,
        pluginsStructure: state.pluginsStructure,
        isRefreshing: state.isRefreshing,
        sizeIsChanging: state.sizeIsChanging,
        notSavedResources: state.notSavedResources,
        barSizes: state.barSizes,
        findMode: state.findMode,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        markRefreshing: refreshing =>
            dispatch(actions.markRefreshing(refreshing)),
        saveBarSizes: barSizes => dispatch(actions.saveBarSizes(barSizes)),
        changeBarSize: (barSizes, initiator) =>
            dispatch(actions.changeBarSize(barSizes, initiator)),
        saveHoveredElementRect: (id, size) =>
            dispatch(actions.saveHoveredElementRect(id, size)),
    }
}

const StopRefresh = connect(
    mapStateToProps,
    mapDispatchToProps
)(props => {
    setTimeout(() => props.markRefreshing(false), 1)
    return <></>
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiteBuilder)
