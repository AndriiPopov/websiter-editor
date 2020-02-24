import React from 'react'
import SelectComponent from 'react-select'
import { connect } from 'react-redux'

import classes from './Select.module.css'
import checkUserRights from '../../../utils/checkUserRights'

import type { initialStateType } from '../../../store/reducer/reducer'

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
    requiredRights?: Array<string>,
    tryWebsiter: $PropertyType<initialStateType, 'tryWebsiter'>,
    websites: $PropertyType<initialStateType, 'websites'>,
    loadedWebsite: $PropertyType<initialStateType, 'loadedWebsite'>,
    userId: $PropertyType<initialStateType, 'userId'>,
}

const Select = (props: Props) => {
    const handleChange = option => {
        if (!props.checkUserRights(props.requiredRights || [])) {
            return
        }
        props.onChange(option)
    }

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

    return (
        <div className={classes.Div}>
            {props.title}
            <SelectComponent
                styles={customStyles}
                value={props.options[props.default] || 0}
                isClearable={props.isClearable}
                isSearchable={props.isSearchable}
                onChange={handleChange}
                options={props.options}
                placeholder={props.placeholder}
            />
        </div>
    )
}

Select.defaultProps = {
    default: 0,
}

const mapDispatchToProps = dispatch => {
    return {
        checkUserRights: rights => dispatch(checkUserRights(rights)),
    }
}

export default connect(
    null,
    mapDispatchToProps
)(Select)
