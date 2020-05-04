import React, { memo } from 'react'
import { SortableTreeWithoutDndContext as SortableTree } from 'react-sortable-tree'
// import SortableTree from 'react-sortable-tree'
import { connect } from 'react-redux'

import * as classes from '../../../../components/ResourcesTree/ResourcesTree.module.css'
// import withDragDropContext from '../../../../hoc/withDragDropContext'
import SmallButton from '../../../../components/UI/Buttons/SmallButton/SmallButton'
import ItemRenderer from './ItemRenderer'
import * as wsActions from '../../../../websocketActions'
import isEqual from 'lodash/isEqual'
import OverlayOnSizeIsChanging from '../../../../components/UI/OverlayOnSizeIsChanging/OverlayOnSizeIsChanging'
import Divider from 'antd/es/divider'
import PlusOutlined from '@ant-design/icons/PlusOutlined'
import DeleteOutlined from '@ant-design/icons/DeleteOutlined'
import ControlPanel from '../../../../components/UI/ControlPanel'

// type Props = {
//     notVirtual?: boolean,
// }

const WebsitesTree = props => (
    <>
        <ControlPanel>
            <SmallButton
                title="Add"
                buttonClicked={() => props.addWebsite()}
                icon={<PlusOutlined />}
                tooltip="Add a new website"
            />
            <Divider type="vertical" />
            {/* <SmallButton
                    mD={props.mD}
                    inline
                    buttonClicked={() => wsActions.addWebsite(props.mD, true)}
                    icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"></path><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"></path></svg>'
                    tooltip="Duplicate website"
                /> */}
            <SmallButton
                title="Delete"
                buttonClicked={() => props.deleteWebsite()}
                icon={<DeleteOutlined />}
                tooltip="Delete website.<br>This action can not be reverted."
            />
        </ControlPanel>
        <div className={classes.TreeContainer}>
            <SortableTree
                treeData={props.treeData}
                onChange={() => {}}
                nodeContentRenderer={ItemRenderer}
                canDrop={() => false}
                canDrag={() => false}
                generateNodeProps={({ node }) => ({
                    className:
                        node.id === props.currentWebsiteId
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
                style={{
                    flex: '1 1',
                    height: 'auto !important',
                    overflow: 'auto',
                }}
                slideRegionSize={20}
            />
            <OverlayOnSizeIsChanging />
        </div>
    </>
)

const mapStateToProps = state => {
    const treeData = state.mD.websites.map(website => {
        return {
            name: state.resourcesObjects[website.id]
                ? state.resourcesObjects[website.id].name
                : 'Loading...',
            id: website.id,
            children: {},
        }
    })
    return {
        treeData,
        currentWebsiteId: state.mD.currentWebsiteId,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        addWebsite: () => dispatch(wsActions.addWebsite()),
        deleteWebsite: () => dispatch(wsActions.deleteWebsite()),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(
    memo(
        WebsitesTree,
        (prevProps, nextProps) =>
            isEqual(prevProps.treeData, nextProps.treeData) &&
            prevProps.currentWebsiteId === nextProps.currentWebsiteId
    )
)
