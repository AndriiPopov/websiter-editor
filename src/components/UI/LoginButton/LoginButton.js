import React from 'react'
import type { Node } from 'react'
import classes from './LoginButton.module.css'

type Props = {
    clicked?: Function,
    disabled?: boolean,
    btnType?: 'Success' | 'Danger',
    children?: Node,
    datatestid?: string,
}

const LoginButton = (props: Props) => (
    <button
        data-testid={props.datatestid || 'LoginButton'}
        disabled={props.disabled}
        className={[classes.Button, classes[props.btnType]].join(' ')}
        onClick={props.clicked}
    >
        {props.children}
    </button>
)

export default LoginButton
