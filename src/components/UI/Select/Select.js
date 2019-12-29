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
    isClearable?: boolean,
    placeholder?: String,
}

const Select = (props: Props) => {
    const customStyles = {
        menu: (provided: {}, state: {}) => ({
            ...provided,
            width: '100%',
            top: 'auto',
            zIndex: '100000',
            margin: '0px',
        }),
        selectContainer: (provided: {}) => ({
            ...provided,
            width: '200px',
            top: 'auto',
        }),
        clearIndicator: provided => ({
            ...provided,
            padding: '0px',
        }),
        dropdownIndicator: provided => ({
            ...provided,
            padding: '0px 5px',
        }),
        control: provided => ({
            ...provided,
            minHeight: 'auto',
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
                // className={classes.Select}
                styles={
                    customStyles
                    // ...props.styles,
                }
                //value={startValue || props.options[props.default]}
                value={props.options[props.default] || 0}
                isClearable={props.isClearable}
                isSearchable={props.isSearchable}
                onChange={props.onChange}
                options={props.options}
                placeholder={props.placeholder}
            />
        </div>
    )
}

Select.defaultProps = {
    default: 0,
}

export default Select
