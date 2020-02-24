import React, { memo } from 'react'
import { connect } from 'react-redux'
import * as actions from '../../../store/actions/index'
import SmallButton from '../../UI/Buttons/SmallButton/SmallButton'
import getBoxType from './methods/getBoxType'
import generateButtonRules from './methods/generateButtonRules'
import { resourceDraftIndex } from '../../../utils/resourceTypeIndex'

import type {
    resourceType,
    initialStateType,
    elementType,
} from '../../../store/reducer/reducer'

export type State = {
    searchString: string,
    searchFocusIndex: number,
    searchFoundCount: null | number,
    searchStringHasBeenCleared: boolean,
    searchOpen: boolean,
}

export type Props = {
    resourceDraft: resourceType,
    currentResource:
        | $PropertyType<initialStateType, 'currentPage'>
        | $PropertyType<initialStateType, 'currentPlugin'>,
    mode: 'page' | 'plugin' | 'template',
    findMode: $PropertyType<initialStateType, 'findMode'>,
    fromFrame: $PropertyType<initialStateType, 'fromFrame'>,
    hoveredElementId: $PropertyType<initialStateType, 'hoveredElementId'>,
    chooseBox: typeof actions.chooseBox,
    addBox: typeof actions.addBox,
    duplicateBox: typeof actions.duplicateBox,
    deleteBox: typeof actions.deleteBox,
    saveElementsStructure: typeof actions.saveElementsStructure,
    hoverBox: typeof actions.hoverBox,
    unhoverBox: typeof actions.unhoverBox,
    mergeBoxToPlugin: typeof actions.mergeBoxToPlugin,
    dissolvePluginToBox: typeof actions.dissolvePluginToBox,
    markShouldRefreshing: typeof actions.markShouldRefreshing,
    toggleFindMode: typeof actions.toggleFindMode,
    currentBoxType:
        | 'html'
        | 'page'
        | 'headBody'
        | 'plugin'
        | 'children'
        | 'childrenTo'
        | 'element'
        | 'isCMSVariable'
        | 'isElementFromCMSVariable'
        | 'none',
    searchQuery: string,
    node: elementType,
}

const Buttons = (props: Props) => {
    const currentBoxType = getBoxType(props)

    const buttonRules = generateButtonRules(props, currentBoxType)

    return (
        <>
            {props.mode !== 'page' ? (
                <>
                    {/* <SmallButton
                        inline
                        buttonClicked={() => props.toggleFindMode(props.mode)}
                        icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M13 1.07V9h7c0-4.08-3.05-7.44-7-7.93zM4 15c0 4.42 3.58 8 8 8s8-3.58 8-8v-4H4v4zm7-13.93C7.05 1.56 4 4.92 4 9h7V1.07z"></path></svg>'
                        tooltip="Select an element on the page"
                    /> */}
                    {buttonRules.addNext ? (
                        <SmallButton
                            inline
                            buttonClicked={() => props.addBox(props.mode)}
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                            tooltip="Add a new element next to the chosen element"
                            requiredRights={['developer']}
                        />
                    ) : null}
                    {buttonRules.addNext ? (
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.addBox(props.mode, 'cmsVariable')
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                            tooltip="Add a new element from CMS variable"
                            requiredRights={['developer']}
                        />
                    ) : null}
                    {buttonRules.addInside ? (
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.addBox(props.mode, 'inside')
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                            tooltip="Add a new element inside the chosen element"
                            requiredRights={['developer']}
                        />
                    ) : null}
                    {buttonRules.addChildren ? (
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.addBox(props.mode, 'children')
                            }
                            title="Children"
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                            tooltip="Add a new inherited children"
                            requiredRights={['developer']}
                        />
                    ) : null}
                    {buttonRules.addText ? (
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.addBox(props.mode, 'text')
                            }
                            title="Text"
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                            tooltip="Add a new text element"
                            requiredRights={['developer']}
                        />
                    ) : null}
                    {buttonRules.duplicate ? (
                        <>
                            <SmallButton
                                inline
                                buttonClicked={() =>
                                    props.duplicateBox(props.mode)
                                }
                                icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                                tooltip="Duplicate the element without children elements"
                                requiredRights={['developer']}
                            />
                            <SmallButton
                                inline
                                buttonClicked={() =>
                                    props.duplicateBox(props.mode, true)
                                }
                                icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M4,3C3,3,2.3,3.8,2.3,4.8v14.4C2.3,20.2,3,21,4,21h10.6c1,0,1.8-0.8,1.8-1.8V8.4L11.3,3H4z M10.4,9.3v-5l4.8,5H10.4z   M17.8,15.9h4V21h-4V15.9z M17.8,9.4h4v5.2h-4V9.4z M21.8,3v5.1h-4V3H21.8z"></path></svg>'
                                tooltip="Duplicate the element with children elements"
                                requiredRights={['developer']}
                            />
                        </>
                    ) : null}

                    {buttonRules.mergeToPlugin ? (
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.mergeBoxToPlugin(props.mode)
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"></path></svg>'
                            tooltip="Merge element and children elements into a new plugin"
                            requiredRights={['developer']}
                        />
                    ) : null}
                    {buttonRules.mergeToPluginChildren ? (
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.mergeBoxToPlugin(props.mode, true)
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15 3l2.3 2.3-2.89 2.87 1.42 1.42L18.7 6.7 21 9V3zM3 9l2.3-2.3 2.87 2.89 1.42-1.42L6.7 5.3 9 3H3zm6 12l-2.3-2.3 2.89-2.87-1.42-1.42L5.3 17.3 3 15v6zm12-6l-2.3 2.3-2.87-2.89-1.42 1.42 2.89 2.87L15 21h6z"></path></svg>'
                            tooltip="Merge children elements into a new plugin"
                            requiredRights={['developer']}
                        />
                    ) : null}
                    {buttonRules.dissolve ? (
                        <SmallButton
                            inline
                            buttonClicked={() =>
                                props.dissolvePluginToBox(props.mode)
                            }
                            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M10 9h4V6h3l-5-5-5 5h3v3zm-1 1H6V7l-5 5 5 5v-3h3v-4zm14 2l-5-5v3h-3v4h3v3l5-5zm-9 3h-4v3H7l5 5 5-5h-3v-3z"></path></svg>'
                            tooltip="Dissolve the plugin into elements"
                            requiredRights={['developer']}
                        />
                    ) : null}

                    {buttonRules.delete ? (
                        <>
                            <SmallButton
                                inline
                                buttonClicked={() =>
                                    props.deleteBox(props.mode)
                                }
                                icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                                tooltip="Delete element without children.<br>All children will remain on the page"
                                requiredRights={['developer']}
                            />
                            <SmallButton
                                inline
                                buttonClicked={() =>
                                    props.deleteBox(props.mode, true)
                                }
                                icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M11.8,3h-5l-1,1H2.3v2h14V4h-3.5L11.8,3z M3.3,19c0,1.1,0.9,2,2,2h8c1.1,0,2-0.9,2-2V7h-12C3.3,7,3.3,19,3.3,19z M17.8,3  v5.1h4V3H17.8z M17.8,21h4v-5.1h-4V21z M17.8,14.6h4V9.4h-4V14.6z"></path></svg>'
                                tooltip="Delete element with all children inside"
                                requiredRights={['developer']}
                            />
                        </>
                    ) : null}
                </>
            ) : null}
            <SmallButton
                inline
                buttonClicked={() =>
                    props.setState({
                        ...props.state,
                        searchOpen: !props.state.searchOpen,
                    })
                }
                icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"></path></svg>'
                tooltip="Show or hide search"
            />
            <SmallButton
                inline
                buttonClicked={() => props.markShouldRefreshing(true)}
                icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"></path></svg>'
                tooltip="Reload page"
            />
        </>
    )
}

const mapStateToProps = (state, props) => {
    return {
        hoveredElementId: -100,
        findMode: state.findMode,
        resourceDraftStructure:
            state.mD[resourceDraftIndex[props.mode]].structure,
        currentBox: state.mD[resourceDraftIndex[props.mode]].currentBox,
    }
}

const mapDispatchToProps = (dispatch, props) => {
    return {
        addBox: (mode, type) => dispatch(actions.addBox(mode, type)),
        duplicateBox: (mode, withChildren) =>
            dispatch(actions.duplicateBox(mode, withChildren)),
        mergeBoxToPlugin: (type, onlyChildren) =>
            dispatch(actions.mergeBoxToPlugin(type, onlyChildren)),
        dissolvePluginToBox: type =>
            dispatch(actions.dissolvePluginToBox(type)),
        deleteBox: (mode, withChildren) =>
            dispatch(actions.deleteBox(mode, withChildren)),
        toggleFindMode: value => dispatch(actions.toggleFindMode(value)),
        markShouldRefreshing: value =>
            dispatch(actions.markShouldRefreshing(value)),
    }
}
// let prevVal
export default connect(
    mapStateToProps,
    mapDispatchToProps
)(memo(Buttons))
