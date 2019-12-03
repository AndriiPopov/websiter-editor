import React, { useState } from 'react'
import {
    handleSearchOnChange,
    selectPrevMatch,
    selectNextMatch,
} from '../../../utils/searchInTree'
import * as classes from './TreeSearch.module.css'
import SmallButton from '../Buttons/SmallButton/SmallButton'

export const TreeSearch = props => (
    <div className={classes.Container}>
        <input
            className={classes.Input}
            type="text"
            onChange={e => handleSearchOnChange(props.state, props.setState, e)}
        />
        <SmallButton
            inline
            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>'
            buttonClicked={() => selectPrevMatch(props.state, props.setState)}
        />
        <SmallButton
            inline
            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>'
            buttonClicked={() => selectNextMatch(props.state, props.setState)}
        />
        <div className={classes.Label}>
            {props.state.searchFoundCount
                ? props.state.searchFocusIndex + 1
                : 0}
            /{props.state.searchFoundCount}
        </div>
    </div>
)
