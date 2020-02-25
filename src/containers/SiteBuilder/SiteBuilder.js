import React, { Component, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

import * as classes from './SiteBuilder.module.css'
import * as actions from '../../store/actions/index'
import Frame, { FrameContextConsumer } from './Frame/index'
import BuilderElement from './BuilderElement/BuilderElement'
import HoveredBoxHighlight from './HoveredBoxHighlight/HoveredBoxHighlight'
import { systemClassMenu } from './systemClasses'
// import saveRect from './methods/saveRect'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { store } from '../../index'
import { refinePropertiesFromCMS } from './BuilderElement/methods/refineProperties'
import refreshPageStructure from './methods/refreshPageStructure'
import Overlay from '../../components/UI/Overlay/Overlay'

import type { initialStateType } from '../../store/reducer/reducer'

export type Props = {
    zoom: $PropertyType<initialStateType, 'pageZoom'>,
    hoveredElementId: $PropertyType<initialStateType, 'hoveredElementId'>,
    isRefreshing: $PropertyType<initialStateType, 'isRefreshing'>,
    notSavedResources: $PropertyType<initialStateType, 'notSavedResources'>,
    barSizes: $PropertyType<initialStateType, 'barSizes'>,
    markRefreshing: typeof actions.markRefreshing,
    savePropertiesOnLeave: typeof actions.savePropertiesOnLeave,
    saveHoveredElementRect: typeof actions.saveHoveredElementRect,
    markShouldRefreshing: typeof actions.markShouldRefreshing,
    shouldRefresh?: boolean,
    saveElementsStructure: typeof actions.saveElementsStructure,
    currentSiteBuilderMode: $PropertyType<
        initialStateType,
        'currentSiteBuilderMode'
    >,
}

type State = {
    headValue: string,
}

class SiteBuilder extends Component<Props, State> {
    state = {
        headValue: '',
    }

    // componentDidMount() {
    //     //saveRect(this.props)
    // }
    head = ''

    // shouldComponentUpdate(nextProps) {
    //     if (nextProps.zoom !== this.props.zoom) return true
    //     if (nextProps.isRefreshing !== this.props.isRefreshing) return true
    //     if (nextProps.isRefreshing !== this.props.isRefreshing) return true
    //     if (nextProps.shouldRefresh !== this.props.shouldRefresh) return true
    //     if (nextProps.pageTemplateId !== this.props.pageTemplateId) return true
    //     if (!isEqual(nextProps.pagesStructure, this.props.pagesStructure))
    //         return true
    //     if (
    //         !isEqual(
    //             nextProps.currentPageDraftStructure,
    //             this.props.currentPageDraftStructure
    //         )
    //     )
    //         return true
    //     if (
    //         !isEqual(
    //             nextProps.pageTemplateDraftStructure,
    //             this.props.pageTemplateDraftStructure
    //         )
    //     )
    //         return true
    //     if (!isEqual(nextProps.refinedProperties, this.props.refinedProperties))
    //         return true
    //     return false
    // }

    componentWillReceiveProps(newProps: Props) {
        if (newProps.pagesStructure) {
            if (
                newProps.currentPageDraftStructure &&
                newProps.pageTemplateDraftStructure
            ) {
                const newStructure = refreshPageStructure(
                    newProps.currentPageDraftStructure,
                    newProps.pageTemplateDraftStructure
                )
                // console.log(newStructure)
                if (
                    !isEqual(newStructure, newProps.currentPageDraftStructure)
                ) {
                    this.props.saveElementsStructureFromBuilder(
                        'page',
                        newStructure
                    )
                } else {
                    const newHead = newProps.pageTemplateDraftStructure
                        .filter(itemInn =>
                            isEqual(itemInn.path, ['element_01', 'element_0'])
                        )
                        .map(itemInn => {
                            return (
                                <BuilderElement
                                    key={itemInn.id}
                                    structure={
                                        newProps.pageTemplateDraftStructure
                                    }
                                    element={itemInn}
                                    hoveredElementId={newProps.hoveredElementId}
                                    document={document}
                                    pluginsPathArray={[]}
                                    parentPluginProps={
                                        newProps.refinedProperties
                                    }
                                    isHead
                                    currentResource={newProps.pageTemplateId}
                                />
                            )
                        })

                    const newHeadString =
                        renderToString(
                            <Provider store={store}>{newHead}</Provider>
                        ) || ''
                    // console.log('newHeadString')
                    // console.log(newHeadString)
                    // console.log(this.state.headValue)
                    if (
                        newHeadString !== this.state.headValue ||
                        newProps.shouldRefresh
                    ) {
                        this.props.markRefreshing(true)
                        this.props.markShouldRefreshing()
                        this.setState({ headValue: newHeadString })
                    }
                }
            }
        }
    }

    render() {
        let frame = null

        if (
            this.props.pageTemplateDraftStructure &&
            this.props.currentPageDraftStructure
        ) {
            const { props } = this
            const zoom = props.zoom / 100
            const size = 100 / zoom + '%'
            const structure = props.pageTemplateDraftStructure

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
                        initialContent={
                            systemClassMenu +
                            ' ' +
                            this.state.headValue +
                            ' <script src="src/tinymce_5.1.5.zip"></script>'
                        }
                    >
                        <FrameContextConsumer>
                            {({ document, window }) => {
                                return structure
                                    ? structure
                                          .filter(itemInn =>
                                              isEqual(itemInn.path, [
                                                  'element_01',
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
                                                  document={document}
                                                  pluginsPathArray={[]}
                                                  parentPluginProps={
                                                      props.refinedProperties
                                                  }
                                                  currentResource={
                                                      props.pageTemplateId
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
            <main
                data-testid="siteBuilderLayoutMain"
                className={classes.Content}
            >
                {frame}
                <Overlay />
            </main>
        )
    }
}

const mapStateToProps = state => {
    const refinedProperties = refinePropertiesFromCMS(state.mD)
    return {
        zoom: state.pageZoom,
        isRefreshing: state.isRefreshing,
        shouldRefresh: state.shouldRefresh,
        pagesStructure: state.mD.pagesStructure,
        currentPageDraftStructure: state.mD.currentPageDraft
            ? state.mD.currentPageDraft.structure
            : null,
        pageTemplateDraftStructure: state.mD.pageTemplateDraft
            ? state.mD.pageTemplateDraft.structure
            : null,
        refinedProperties,
        pageTemplateId: state.mD.pageTemplateId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        markRefreshing: refreshing =>
            dispatch(actions.markRefreshing(refreshing)),
        saveHoveredElementRect: (id, size) =>
            dispatch(actions.saveHoveredElementRect(id, size)),
        markShouldRefreshing: value =>
            dispatch(actions.markShouldRefreshing(value)),
        saveElementsStructure: (type, structure) =>
            dispatch(actions.saveElementsStructure(type, structure)),
        saveElementsStructureFromBuilder: (type, structure) =>
            dispatch(actions.saveElementsStructureFromBuilder(type, structure)),
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
