import React from 'react'

import classes from './LoginInput.module.css'

type Props = {
    invalid?: boolean,
    shouldValidate?: boolean,
    touched?: boolean,
    type: 'text' | 'password',
    passwordVisible?: boolean,
    password?: boolean,
    togglePasswordVisible?: Function,
    changed: Function,
    value?: string,
    placeholder?: string,
    label?: string,
    datatestid?: string,
}

const LoginInput = (props: Props) => {
    const inputClasses = [classes.InputElement]

    if (props.invalid && props.shouldValidate && props.touched) {
        inputClasses.push(classes.Invalid)
    }
    let type = props.type
    if (props.passwordVisible) {
        type = 'text'
    }

    const passwordToggle = props.password ? (
        <div
            data-testid="toggle"
            onClick={props.togglePasswordVisible}
            className={
                props.passwordVisible
                    ? classes.PasswordIsVisible
                    : classes.PasswordIsHidden
            }
        />
    ) : null

    return (
        <div className={classes.Input}>
            <label className={classes.Label}>{props.label}</label>
            <input
                data-testid={props.datatestid || 'loginInput'}
                className={inputClasses.join(' ')}
                type={type}
                placeholder={props.placeholder}
                value={props.value}
                onChange={props.changed}
            />
            {passwordToggle}
        </div>
    )
}

export default LoginInput
