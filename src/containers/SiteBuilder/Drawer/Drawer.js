import React, { useState } from 'react'
import Sidebar from 'react-sidebar'

const Drawer = props => {
    const [state, setState] = useState()

    const onSwitch = () => {
        setState(!state)
    }
    return (
        <>
            <div onClick={onSwitch}>{props.handler}</div>
            <Sidebar
                sidebar={<div>{props.content}</div>}
                open={state}
                onSetOpen={() => setState()}
                // styles={{ sidebar: { background: 'white' } }}
            />
        </>
    )
}

export default Drawer
