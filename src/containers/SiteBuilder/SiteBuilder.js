import React, { Component, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import { isEqual, cloneDeep } from 'lodash'
import ReactDOMServer from 'react-dom/server'

import { getCurrentResourceValue } from '../../utils/basic'
import * as classes from './SiteBuilder.module.css'
import * as actions from '../../store/actions/index'
import Frame, { FrameContextConsumer } from './Frame/index'
import SiteBuilderLayout from '../../components/SiteBuilderLayout/SiteBuilderLayout'
import BuilderElement from './BuilderElement/BuilderElement'
import HoveredBoxHighlight from './HoveredBoxHighlight/HoveredBoxHighlight'
import { systemClassMenu } from './systemClasses'
import { Beforeunload } from 'react-beforeunload'
import ReactResizeDetector from 'react-resize-detector'
import saveRect from './methods/saveRect'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { store } from '../../index'

import type {
    resourceType,
    initialStateType,
} from '../../store/reducer/reducer'

export type Props = {
    zoom: $PropertyType<initialStateType, 'pageZoom'>,
    currentPage: $PropertyType<initialStateType, 'currentPage'>,
    currentPlugin: $PropertyType<initialStateType, 'currentPlugin'>,
    resourcesObjects: $PropertyType<initialStateType, 'resourcesObjects'>,
    pagesStructure: $PropertyType<initialStateType, 'pagesStructure'>,
    pluginsStructure: $PropertyType<initialStateType, 'pluginsStructure'>,
    hoveredElementId: $PropertyType<initialStateType, 'hoveredElementId'>,
    isRefreshing: $PropertyType<initialStateType, 'isRefreshing'>,
    sizeIsChanging: $PropertyType<initialStateType, 'sizeIsChanging'>,
    notSavedResources: $PropertyType<initialStateType, 'notSavedResources'>,
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
    tooltipsOn: $PropertyType<initialStateType, 'tooltipsOn'>,
    markRefreshing: typeof actions.markRefreshing,
    savePropertiesOnLeave: typeof actions.savePropertiesOnLeave,
    changeBarSize: typeof actions.changeBarSize,
    saveHoveredElementRect: typeof actions.saveHoveredElementRect,
}

type State = {
    headValue: string,
}

class SiteBuilder extends Component<Props, State> {
    state = {
        headValue: '',
    }

    componentDidMount() {
        saveRect(this.props)
    }
    head = ''

    async componentWillReceiveProps(newProps: Props) {
        const currentPageItemInStructure = newProps.pagesStructure.find(
            item => item.id === newProps.currentPage
        )
        const resourceDraft = getCurrentResourceValue(
            newProps.currentPage,
            newProps.resourcesObjects
        )
        const newHead = resourceDraft
            ? resourceDraft.structure
                ? resourceDraft.structure
                      .filter(itemInn =>
                          isEqual(itemInn.path, ['element_-1', 'element_0'])
                      )
                      .map(itemInn => (
                          <BuilderElement
                              key={itemInn.id}
                              structure={resourceDraft.structure}
                              element={itemInn}
                              hoveredElementId={newProps.hoveredElementId}
                              pluginsStructure={newProps.pluginsStructure}
                              resourcesObjects={newProps.resourcesObjects}
                              document={document}
                              pluginsPathArray={[]}
                              resourceDraft={resourceDraft}
                              currentResource={newProps.currentPage}
                              pageInStructure={currentPageItemInStructure}
                          />
                      ))
                : ''
            : ''
        const newHeadString = renderToString(
            <Provider store={store}>{newHead}</Provider>
        )

        if (newHeadString) {
            if (newHeadString !== this.state.headValue) {
                this.props.markRefreshing(true)
                this.setState({ headValue: newHeadString })
            }
        }
    }

    checkOnLeave = e => {
        //check if there are unsaved resources before leave
        this.props.savePropertiesOnLeave(
            this.props.barSizes,
            this.props.tooltipsOn,
            this.props.currentPage,
            this.props.currentPlugin
        )
        if (this.props.notSavedResources.length > 0)
            return 'Some data is not saved.'
        else return undefined
    }

    render() {
        const currentPageItemInStructure = this.props.pagesStructure.find(
            item => item.id === this.props.currentPage
        )
        const resourceDraft = getCurrentResourceValue(
            this.props.currentPage,
            this.props.resourcesObjects
        )

        let frame = null
        if (resourceDraft) {
            const { props } = this
            const zoom = props.zoom / 100
            const size = 100 / zoom + '%'
            const structure = resourceDraft.structure

            const bodyElement = structure.filter(
                item => item.path.length === 1
            )[1]
            const bodyProps = cloneDeep(bodyElement.properties)
            const bodyStyle = bodyElement.style
            if (bodyStyle) bodyProps.style = bodyStyle

            const htmlElement = structure.filter(
                item => item.path.length === 0
            )[0]
            const htmlProps = cloneDeep(htmlElement.properties)
            const htmlStyle = htmlElement.style
            if (htmlStyle) htmlProps.style = htmlStyle

            frame = this.props.isRefreshing ? (
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
                            this.state.headValue
                        }</head><body></body></html>`}
                    >
                        <FrameContextConsumer>
                            {({ document, window }) => {
                                return structure
                                    ? structure
                                          .filter(itemInn =>
                                              isEqual(itemInn.path, [
                                                  'element_-1',
                                                  'element_1',
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
                                                  resourceDraft={resourceDraft}
                                                  currentResource={
                                                      this.props.currentPage
                                                  }
                                                  pageInStructure={
                                                      currentPageItemInStructure
                                                  }
                                              />
                                          ))
                                    : null
                            }}
                        </FrameContextConsumer>
                        <HoveredBoxHighlight />
                    </Frame>
                </>
            )
        }
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
                    {frame}
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
        currentPlugin: state.currentPlugin,
        resourcesObjects: state.resourcesObjects,
        pluginsStructure: state.pluginsStructure,
        pagesStructure: state.pagesStructure,
        isRefreshing: state.isRefreshing,
        sizeIsChanging: state.sizeIsChanging,
        notSavedResources: state.notSavedResources,
        barSizes: state.barSizes,
        findMode: state.findMode,
        tooltipsOn: state.tooltipsOn,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        markRefreshing: refreshing =>
            dispatch(actions.markRefreshing(refreshing)),
        savePropertiesOnLeave: (
            barSizes,
            tooltipsOn,
            currentPage,
            currentPlugin
        ) =>
            dispatch(
                actions.savePropertiesOnLeave(
                    barSizes,
                    tooltipsOn,
                    currentPage,
                    currentPlugin
                )
            ),
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
    const span = useRef(null)
    useEffect(() => {
        if (span.current) {
            props.markRefreshing(false)
        }
    })
    return <span ref={span} style={{ display: 'none' }} />
})
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SiteBuilder)
