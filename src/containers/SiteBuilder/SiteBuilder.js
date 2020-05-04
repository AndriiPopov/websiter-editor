import React, { Component, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'

import * as classes from './SiteBuilder.module.css'
import * as actions from '../../store/actions/index'
import Frame, { FrameContextConsumer } from './Frame/index'
import BuilderElement from './BuilderElement/BuilderElement'
import HoveredBoxHighlight from './HoveredBoxHighlight/HoveredBoxHighlight'
// import { systemClassMenu, systemClassDrawer } from './systemClasses'
// import saveRect from './methods/saveRect'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import { store } from '../../index'
import refineProperties, {
    refinePropertiesFromCMS,
} from './BuilderElement/methods/refineProperties'
import refreshPageStructure from './methods/refreshPageStructure'
import Overlay from '../../components/UI/Overlay/Overlay'

// import type { initialStateType } from '../../store/reducer/reducer'

// export type Props = {
//     zoom: $PropertyType<initialStateType, 'pageZoom'>,
//     hoveredElementId: $PropertyType<initialStateType, 'hoveredElementId'>,
//     isRefreshing: $PropertyType<initialStateType, 'isRefreshing'>,
//     notSavedResources: $PropertyType<initialStateType, 'notSavedResources'>,
//     barSizes: $PropertyType<initialStateType, 'barSizes'>,
//     markRefreshing: typeof actions.markRefreshing,
//     savePropertiesOnLeave: typeof actions.savePropertiesOnLeave,
//     saveHoveredElementRect: typeof actions.saveHoveredElementRect,
//     markShouldRefreshing: typeof actions.markShouldRefreshing,
//     shouldRefresh?: boolean,
//     saveElementsStructure: typeof actions.saveElementsStructure,
//     currentSiteBuilderMode: $PropertyType<
//         initialStateType,
//         'currentSiteBuilderMode'
//     >,
// }

// type State = {
//     headValue: string,
// }

class SiteBuilder extends Component {
    state = {
        headValue: '',
    }

    // componentDidMount() {
    //     //saveRect(this.props)
    // }
    head = ''
    currentScroll = 0

    componentDidUpdate(prevProps) {
        if (prevProps.currentPageId !== this.props.currentPageId) {
            this.currentScroll = 0
        }
        const iframeElement = document.getElementById('builderFrame')
        if (iframeElement) {
            if (!this.props.isRefreshing) {
                setTimeout(() => {
                    const iframeElement = document.getElementById(
                        'builderFrame'
                    )
                    if (iframeElement) {
                        iframeElement.contentWindow.document.documentElement.scrollTop = iframeElement.contentWindow.document.body.scrollTop = this.currentScroll
                        iframeElement.contentWindow.scrollTo(
                            this.currentScroll,
                            this.currentScroll
                        )
                    }
                }, 1)
            }
        }
    }

    shouldComponentUpdate(nextProps) {
        return !this.props.sizeIsChanging && !nextProps.sizeIsChanging
    }

    componentWillReceiveProps(newProps) {
        if (!newProps.isRefreshing) {
            const iframeElement = document.getElementById('builderFrame')
            if (iframeElement) {
                this.currentScroll =
                    iframeElement.contentWindow.document.documentElement
                        .scrollTop ||
                    iframeElement.contentWindow.document.body.scrollTop
            }
        }

        if (newProps.pagesStructure) {
            if (newProps.refreshedGlobalStructure) {
                this.props.saveElementsStructureFromBuilder(
                    ...newProps.refreshedGlobalStructure
                )
                return
            }

            if (
                newProps.currentPageDraftStructure &&
                newProps.pageTemplateDraftStructure
            ) {
                if (newProps.refreshedPageStructure) {
                    this.props.saveElementsStructureFromBuilder(
                        ...newProps.refreshedPageStructure
                    )
                    return
                }

                const newHead = newProps.pageTemplateDraftStructure
                    .filter(itemInn =>
                        isEqual(itemInn.path, ['element_01', 'element_0'])
                    )
                    .map(itemInn => {
                        return (
                            <BuilderElement
                                key={itemInn.id}
                                structure={newProps.pageTemplateDraftStructure}
                                element={itemInn}
                                hoveredElementId={newProps.hoveredElementId}
                                document={document}
                                pluginsPathArray={[]}
                                parentPluginProps={newProps.refinedProperties}
                                isHead
                                currentResource={newProps.pageTemplateId}
                            />
                        )
                    })

                const newHeadString =
                    renderToString(
                        <Provider store={store}>{newHead}</Provider>
                    ) || ''
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
    prod = process.env.NODE_ENV !== 'development'

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

            const bodyProps = cloneDeep(props.bodyValues.properties)
            const bodyStyle = props.bodyValues.style
            if (typeof bodyStyle === 'string') bodyProps.style = bodyStyle

            const htmlProps = cloneDeep(props.htmlValues.properties)
            const htmlStyle = props.htmlValues.style
            if (typeof htmlStyle === 'string') htmlProps.style = htmlStyle
            // const iframeElement = document.getElementById('builderFrame')

            // if (this.props.isRefreshing && iframeElement) {
            //     this.setState({
            //         currentScroll:
            //             iframeElement.contentWindow.document.documentElement
            //                 .scrollTop ||
            //             iframeElement.contentWindow.document.body.scrollTop,
            //     })
            // }
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
                            position: 'absolute',
                        }}
                        bodyProps={bodyProps}
                        htmlProps={htmlProps}
                        base={`  <base href="http${
                            this.prod ? 's' : ''
                        }://live.websiter.${this.prod ? 'dev' : 'test:5000'}/${
                            this.props.currentWebsiteObject.domain
                        }/" />  `}
                        initialContent={
                            // systemClassMenu +
                            // ' ' +
                            // systemClassDrawer +
                            // ' ' +
                            '<link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" /><link rel="stylesheet" type="text/css" href="https://websiter.s3.us-east-2.amazonaws.com/systemClasses.css">' +
                            this.state.headValue
                            // +
                            // ' <script src="src/tinymce_5.1.5.zip"></script>'
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
    let bodyRawValues = {
        properties: {},
        style: '',
    }

    let htmlRawValues = {
        properties: {},
        style: '',
    }

    if (state.mD.pageTemplateFSBDraft) {
        bodyRawValues = state.mD.pageTemplateFSBDraft.values.element_1
        htmlRawValues = state.mD.pageTemplateFSBDraft.values.element_01
    }

    const bodyValues = {
        properties: refineProperties({
            parentPluginProps: refinedProperties,
            elementValues: bodyRawValues,
        }),
        style: bodyRawValues.style,
    }

    const htmlValues = {
        properties: refineProperties({
            parentPluginProps: refinedProperties,
            elementValues: htmlRawValues,
        }),
        style: htmlRawValues.style,
    }

    const currentPageDraftStructureGlobalSettings = state.mD
        .globalSettingsPageDraft
        ? state.mD.globalSettingsPageDraft.structure
        : null
    const pageTemplateDraftStructureGlobalSettings = state.mD
        .globalSettingsTemplateDraft
        ? state.mD.globalSettingsTemplateDraft.structure
        : null

    const currentPageDraftStructure = state.mD.currentPageFSBDraft
        ? state.mD.currentPageFSBDraft.structure
        : null
    const pageTemplateDraftStructure = state.mD.pageTemplateFSBDraft
        ? state.mD.pageTemplateFSBDraft.structure
        : null
    const refreshedPageStructure = refreshPageStructure(
        state.mD,
        state.mD.currentPageFSBDraft || null,
        state.mD.pageTemplateFSBDraft || null,
        false,
        state.mD.pageTemplateFSBId
    )
    const refreshedGlobalStructure = refreshPageStructure(
        state.mD,
        state.mD.globalSettingsPageDraft || null,
        state.mD.globalSettingsTemplateDraft || null,
        true,
        state.mD.globalSettingsTemplateId
    )

    return {
        currentPageId: state.mD.currentPageId,
        zoom: state.pageZoom,
        isRefreshing: state.isRefreshing,
        shouldRefresh: state.shouldRefresh,
        pagesStructure: state.mD.pagesStructure,
        currentPageDraftStructure,
        pageTemplateDraftStructure,
        currentPageDraftStructureGlobalSettings,
        pageTemplateDraftStructureGlobalSettings,
        refinedProperties,
        bodyValues,
        htmlValues,
        pageTemplateId: state.mD.pageTemplateFSBId,
        sizeIsChanging: state.sizeIsChanging,
        refreshedGlobalStructure,
        refreshedPageStructure,
        currentWebsiteObject: state.mD.currentWebsiteObject,
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
        saveElementsStructureFromBuilder: (type, structure, globalSettings) =>
            dispatch(
                actions.saveElementsStructureFromBuilder(
                    type,
                    structure,
                    globalSettings
                )
            ),
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
