import React from 'react'
import { connect } from 'react-redux'
import Tabs from 'antd/es/tabs'
import * as actions from '../../store/actions'
import SmallButton from '../UI/Buttons/SmallButton/SmallButton'

import CloseCircleOutlined from '@ant-design/icons/CloseCircleOutlined'
import PushpinOutlined from '@ant-design/icons/PushpinOutlined'
// type Props = {
//     barSizes: $PropertyType<initialStateType, 'barSizes'>,
//     changeBoxProperty: typeof actions.changeBoxProperty,
// }

const PinnedElementsBar = props => {
    const onEdit = (targetKey, action) => {
        if (action === 'remove') props.removePinnedElement(targetKey)
    }

    const onChange = activeKey => {
        props.setActivePinnedElement(activeKey)
    }

    const activeKey = props.activePinnedElement
    // return <div />
    return (
        <Tabs
            onChange={onChange}
            activeKey={activeKey.toString()}
            type="editable-card"
            onEdit={onEdit}
            hideAdd={true}
            size="small"
            style={{ flex: '0 33px' }}
        >
            {props.pinnedElementsWithTitles.map(tab => {
                const isActive = activeKey.toString() === tab.id.toString()
                return (
                    <Tabs.TabPane
                        tab={
                            <>
                                {isActive && !tab.pinned && (
                                    <SmallButton
                                        tooltip="Pin the tab"
                                        icon={<PushpinOutlined />}
                                        buttonClicked={() =>
                                            props.pinPinnedElement(tab.id)
                                        }
                                        style={{
                                            height: '20px',
                                            width: '20px',
                                            padding: 0,
                                            lineHeight: 0,
                                        }}
                                    />
                                )}
                                {tab.title}
                            </>
                        }
                        key={tab.id}
                        closable={!isActive}
                        closeIcon={<CloseCircleOutlined />}
                    />
                )
            })}
        </Tabs>
    )
}

const mapStateToProps = state => {
    return {
        pinnedElementsWithTitles: state.mD.pinnedElementsWithTitles || [],
        activePinnedElement: state.activePinnedElement,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setActivePinnedElement: pinnedElement =>
            dispatch(actions.setActivePinnedElement(pinnedElement)),
        removePinnedElement: pinnedElement =>
            dispatch(actions.removePinnedElement(pinnedElement)),
        pinPinnedElement: pinnedElement =>
            dispatch(actions.pinPinnedElement(pinnedElement)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(PinnedElementsBar)
