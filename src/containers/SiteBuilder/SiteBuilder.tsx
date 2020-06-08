import React, { Component, useRef, useEffect } from 'react'
import { connect } from 'react-redux'
import isEqual from 'lodash/isEqual'
import cloneDeep from 'lodash/cloneDeep'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'

import * as classes from './SiteBuilder.module.css'
import * as actions from '../../store/actions/index'
import Frame, { FrameContextConsumer } from './Frame/index'
import BuilderElement from './BuilderElement/BuilderElement'
import HoveredBoxHighlight from './HoveredBoxHighlight/HoveredBoxHighlight'
import { store } from '../../index'
import refineProperties, {
    refinePropertiesFromCMS,
} from './BuilderElement/methods/refineProperties'
import refreshPageStructure, {
    refreshedPageStructureType,
} from './methods/refreshPageStructure'
import Overlay from '../../components/UI/Overlay/Overlay'
import { mDType } from '../../Types/mD'
import { storeType } from '../../Types/store'
import { resourceType } from '../../Types/resource'
import { elementValuesType } from '../../Types/elementValues'
// import { systemClassMenu, systemClassDrawer } from './systemClasses'
// import saveRect from './methods/saveRect'

type Props = {
    currentPageId: mDType['currentPageId']
    zoom: storeType['pageZoom']
    isRefreshing: storeType['isRefreshing']
    shouldRefresh: storeType['shouldRefresh']
    pagesStructure: mDType['pagesStructure']
    currentPageDraftStructure: resourceType['structure']
    pageTemplateDraftStructure: resourceType['structure']
    currentPageDraftStructureGlobalSettings: resourceType['structure']
    pageTemplateDraftStructureGlobalSettings: resourceType['structure']
    refinedProperties: {}
    bodyValues: elementValuesType
    htmlValues: elementValuesType
    pageTemplateId: mDType['pageTemplateFSBId']
    sizeIsChanging: storeType['sizeIsChanging']
    refreshedGlobalStructure: refreshedPageStructureType
    refreshedPageStructure: refreshedPageStructureType
    currentWebsiteObject: mDType['currentWebsiteObject']
    prod: mDType['prod']
    saveElementsStructureFromBuilder: typeof actions.saveElementsStructureFromBuilder
    markRefreshing: typeof actions.markRefreshing
    markShouldRefreshing: typeof actions.markShouldRefreshing
}

class SiteBuilder extends Component<Props> {
    state = {
        headValue: '',
    }

    // componentDidMount() {
    //     //saveRect(this.props)
    // }
    head = ''
    currentScroll = 0

    componentDidUpdate(prevProps: Props) {
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

    shouldComponentUpdate(nextProps: Props) {
        return !this.props.sizeIsChanging && !nextProps.sizeIsChanging
    }

    componentWillReceiveProps(newProps: Props) {
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
                                // hoveredElementId={newProps.hoveredElementId}
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

    render() {
        let frame = null

        if (
            this.props.pageTemplateDraftStructure &&
            this.props.currentPageDraftStructure &&
            this.props.currentWebsiteObject
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
                            this.props.prod ? 's' : ''
                        }://${
                            this.props.currentWebsiteObject.domain
                        }.live.websiter.${
                            this.props.prod ? 'dev' : 'test:5000'
                        }/" />  `}
                        initialContent={
                            // systemClassMenu +
                            // ' ' +
                            // systemClassDrawer +
                            // ' ' +
                            '<link rel="stylesheet" type="text/css" charset="UTF-8" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css" /><link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css" /><link rel="stylesheet" type="text/css" href="https://websiter.s3.us-east-2.amazonaws.com/systemClasses.css">' +
                            this.state.headValue + '<style>.websiterDevSlider__slider__wrapper { position: relative; height: 100vh; width: 600px; overflow: hidden; white-space: nowrap; } .websiterDevSlider__arrow { width: 48px; height: 48px; margin-top: -31px; cursor: pointer; transition: transform ease-in-out .2s; } .websiterDevSlider__left { border-bottom: 6px solid; border-left: 6px solid; transform: rotate(45deg); left: 10px } .websiterDevSlider__right { border-bottom: 6px solid; border-left: 6px solid; transform: rotate(-135deg) } .websiterDevSlider__left:hover { transform: rotate(45deg) scale(1.1); } .websiterDevSlider__right:hover { transform: rotate(-135deg) scale(1.1); } .websiterDevSlider__dot { padding: 10px; margin-right: 5px; cursor: pointer; border-radius: 50%; } .websiterDevSlider__active { background: black; } .websiterDevSlider__non_active { background: white; } .websiterDevSlider__dots { position: absolute; bottom: 25px; width: 100%; display: flex; align-items: center; justify-content: center; } .websiterDevSlider__slidesText {margin: 0 auto; font-size: 1.5rem; width: 100%; position: relative; white-space: normal; background-color: rgba(255, 255, 255, 0.6); text-align: center;} .websiterDevSlider__slidesText p {margin: 0; padding: 5px 0} </style>'
                            // +
                            // ' <script src="src/tinymce_5.1.5.zip"></script>'
                        }>
                        <FrameContextConsumer>
                            {({ document, window }: any) => {
                                window.onbeforeunload = function() {
                                    return 'You have unsaved changes!'
                                }
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
                                                  //   hoveredElementId={
                                                  //       props.hoveredElementId
                                                  //   }
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
        prod: state.mD.prod,
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
