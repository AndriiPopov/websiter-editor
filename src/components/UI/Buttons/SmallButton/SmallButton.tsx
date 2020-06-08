import React from 'react'

import Tooltip from 'antd/es/tooltip'
import Button from 'antd/es/button'

import Dropdown from 'antd/es/dropdown'
import DownOutlined from '@ant-design/icons/DownOutlined'

type Props = {
    title?: string
    buttonClicked?: Function
    mouseDown?: Function
    icon?: JSX.Element
    googleFontIcon?: string
    inline?: boolean
    tooltip?: string
    disabled?: boolean
    requiredRights?: Array<string>
    overlay?: JSX.Element
    style?: {}
}

export const SmallButton = (props: Props) => {
    const handleButtonClick = () => {
        if (props.buttonClicked) {
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
                <Tooltip title={props.tooltip} mouseEnterDelay={0.5}>
                    {leftButton}
                </Tooltip>,
                <Button icon={<DownOutlined />} />,
            ]}
            style={props.style}
        >
            {props.icon}
            {props.title}
        </Dropdown.Button>
    ) : (
        <Tooltip title={props.tooltip} mouseEnterDelay={0.5}>
            <Button
                icon={props.icon}
                onClick={handleButtonClick}
                size="middle"
                // style={{ margin: '0px 4px' }}
                type={props.type}
                style={props.style}
            >
                {props.title}
            </Button>
        </Tooltip>
    )
}

export default SmallButton
