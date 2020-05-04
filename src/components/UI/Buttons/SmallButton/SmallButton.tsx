import React from 'react'
import { connect } from 'react-redux'

import checkUserRights from '../../../../utils/checkUserRights'

import Tooltip from 'antd/es/tooltip'
import Button from 'antd/es/button'

import Dropdown from 'antd/es/dropdown'
import DownOutlined from '@ant-design/icons/DownOutlined'

type Props = {
    title?: string
    buttonClicked?: Function
    mouseDown?: Function
    icon?: string
    googleFontIcon?: string
    inline?: boolean
    tooltip?: string
    disabled?: boolean
    requiredRights?: Array<string>
}

export const SmallButton = props => {
    const handleButtonClick = () => {
        if (props.buttonClicked) {
            if (props.requiredRights)
                if (!props.checkUserRights(props.requiredRights || [])) {
                    return
                }
            if (props.buttonClicked) props.buttonClicked()
        }
    }
    return props.overlay ? (
        <Dropdown.Button
            overlay={props.overlay}
            onClick={handleButtonClick}
            size="middle"
            // style={{ margin: '0px 4px' }}
            type={props.type}
            buttonsRender={([leftButton, rightButton]) => [
                <Tooltip title={props.tooltip} mouseEnterDelay={0.2}>
                    {leftButton}
                </Tooltip>,
                <Button icon={<DownOutlined />} />,
            ]}
        >
            {props.icon}
            {props.title}
        </Dropdown.Button>
    ) : (
        <Tooltip title={props.tooltip} mouseEnterDelay={0.2}>
            <Button
                icon={props.icon}
                onClick={handleButtonClick}
                size="middle"
                // style={{ margin: '0px 4px' }}
                type={props.type}
            >
                {props.title}
            </Button>
        </Tooltip>
    )
}

const mapDispatchToProps = dispatch => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(SmallButton)
