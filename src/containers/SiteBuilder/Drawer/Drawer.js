import React, { useState } from 'react'
import DrawerElement from 'rc-drawer'

const Drawer = props => {
    const [state, setState] = useState()

    const onTouchEnd = () => {
        setState(false)
    }
    const onSwitch = () => {
        setState(!state)
    }
    return (
        <>
            {props.handler && <div onClick={onSwitch}>{props.handler}</div>}
            <DrawerElement
                open={state}
                onClose={onTouchEnd}
                handler={props.autoHandler}
                level={null}
                width="200px"
                getContainer={() =>
                    props.refinedProperties.container
                        ? props.document.getElementById(
                              props.refinedProperties.container
                          ) || props.document.body
                        : props.document.body
                }
                onHandleClick={onSwitch}
            >
                {props.content}
            </DrawerElement>
        </>
    )
}

export default Drawer
