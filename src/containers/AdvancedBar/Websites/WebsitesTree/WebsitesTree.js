import React from 'react'
import { connect } from 'react-redux'
import SortableTree from 'react-sortable-tree'

import * as actions from '../../../../store/actions/index'
import * as classes from '../../../../components/ResourcesTree/ResourcesTree.module.css'
import withDragDropContext from '../../../../hoc/withDragDropContext'
import SmallButton from '../../../../components/UI/Buttons/SmallButton/SmallButton'
import ItemRenderer from './ItemRenderer'

import type { initialStateType } from '../../../../store/reducer/reducer'

type Props = {
    addWebsite: typeof actions.addWebsite,
    loadWebsite: typeof actions.loadWebsite,
    duplicateWebsite: typeof actions.addWebsite,
    deleteWebsite: typeof actions.deleteWebsite,
    currentWebsite: $PropertyType<initialStateType, 'currentWebsite'>,
    websites: $PropertyType<initialStateType, 'websites'>,
    notSavedResources: $PropertyType<initialStateType, 'notSavedResources'>,
    notVirtual?: boolean,
}

const WebsitesTree = (props: Props) => {
    const treeData = props.websites.map(website => {
        return {
            ...website,
            id: website._id,
            children: {},
        }
    })

    return (
        <>
            <div>
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.loadWebsite(
                            props.currentWebsite,
                            props.notSavedResources
                        )
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"></path></svg>'
                    tooltip="Load website.<br>All unsaved data in the currently loaded website will be lost."
                />
                <SmallButton
                    inline
                    buttonClicked={() => props.addWebsite()}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path></svg>'
                    tooltip="Add a new website"
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.addWebsite(true, props.currentWebsite)
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                    tooltip="Duplicate website"
                />
                <SmallButton
                    inline
                    buttonClicked={() =>
                        props.deleteWebsite(props.currentWebsite)
                    }
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>'
                    tooltip="Delete website.<br>This action can not be reverted."
                />
            </div>
            <div className={classes.TreeContainer}>
                <SortableTree
                    treeData={treeData}
                    onChange={() => {}}
                    nodeContentRenderer={ItemRenderer}
                    canDrop={() => false}
                    canDrag={() => false}
                    generateNodeProps={({ node }) => ({
                        className:
                            node.id === props.currentWebsite
                                ? [classes.Chosen]
                                : null,
                    })}
                    isVirtualized={!props.notVirtual}
                    onMoveNode={({ node, treeIndex, path }) =>
                        global.console.debug(
                            'node:',
                            node,
                            'treeIndex:',
                            treeIndex,
                            'path:',
                            path
                        )
                    }
                    scaffoldBlockPxWidth={22}
                    rowHeight={20}
                />
            </div>
        </>
    )
}

const mapStateToProps = state => {
    return {
        currentWebsite: state.currentWebsite,
        websites: state.websites,
        domainNotOk: state.domainNotOk,
        notSavedResources: state.notSavedResources,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        loadWebsite: (id, notSavedResources) =>
            dispatch(actions.loadWebsite(id, notSavedResources)),
        addWebsite: (duplicate, currentWebsite) =>
            dispatch(actions.addWebsite(duplicate, currentWebsite)),
        deleteWebsite: id => dispatch(actions.deleteWebsite(id)),
    }
}

export default withDragDropContext(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(WebsitesTree)
)
