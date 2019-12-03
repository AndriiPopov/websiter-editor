import React from 'react'
import SelectComponent from 'react-select'

import classes from './Select.module.css'

type Props = {
    startValue?: any,
    title?: string,
    onChange: Function,
    datatestid?: string,
    styles?: {},
    options: Array<{
        value: string,
        label: string,
    }>,
    default: number,
    isSearchable?: boolean,
}

const Select = (props: Props) => {
    const customStyles = {
        menu: (provided: {}, state: {}) => ({
            ...provided,
            width: '200px',
            top: 'auto',
        }),
        selectContainer: (provided: {}, state: {}) => ({
            ...provided,
            width: '200px',
            top: 'auto',
        }),
    }

    let startValue
    if (props.startValue) {
        startValue = props.options.filter(
            option => option.value === props.startValue
        )
        startValue = startValue.length === 1 ? startValue[0] : null
    }

    return (
        <div className={classes.Div}>
            {props.title}
            <SelectComponent
                className={classes.Select}
                styles={{
                    ...customStyles,
                    ...props.styles,
                }}
                value={startValue || props.options[props.default]}
                isClearable={false}
                isSearchable={props.isSearchable}
                onChange={props.onChange}
                options={props.options}
            />
        </div>
    )
}

Select.defaultProps = {
    default: 0,
}

export default Select
