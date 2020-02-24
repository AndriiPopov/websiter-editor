import React from 'react'

import * as classes from './TreeSearch.module.css'
import SmallButton from '../Buttons/SmallButton/SmallButton'

import type { State } from '../../ElementsTreeAndProperties/ElementsTree/ElementsTree'

type Props = {
    state: State,
    setState: Function,
}

const handleSearchOnChange = (state, setState, e) => {
    setState({ ...state, searchString: e.target.value })
}

const selectPrevMatch = (state, setState) => {
    const { searchFocusIndex, searchFoundCount } = state

    setState({
        ...state,
        searchFocusIndex:
            searchFoundCount !== null
                ? searchFocusIndex !== null
                    ? (searchFoundCount + searchFocusIndex - 1) %
                      searchFoundCount
                    : searchFoundCount - 1
                : null,
    })
}

const selectNextMatch = (state, setState) => {
    const { searchFocusIndex, searchFoundCount } = state

    setState({
        ...state,
        searchFocusIndex:
            searchFoundCount !== null
                ? searchFocusIndex !== null
                    ? (searchFocusIndex + 1) % searchFoundCount
                    : 0
                : null,
    })
}

export const TreeSearch = (props: Props) => (
    <div className={classes.Container}>
        <input
            className={classes.Input}
            type="text"
            onChange={e => handleSearchOnChange(props.state, props.setState, e)}
        />
        <div className={classes.Label}>
            {props.state.searchFoundCount
                ? props.state.searchFocusIndex + 1
                : 0}
            /{props.state.searchFoundCount}
        </div>
        <SmallButton
            inline
            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path></svg>'
            buttonClicked={() => selectPrevMatch(props.state, props.setState)}
            tooltip="Search previous"
        />
        <SmallButton
            inline
            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"></path></svg>'
            buttonClicked={() => selectNextMatch(props.state, props.setState)}
            tooltip="Search next"
        />
        <SmallButton
            inline
            icon='<svg width="18" height="18" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"></path></svg>'
            buttonClicked={() =>
                props.setState({
                    ...props.state,
                    searchOpen: false,
                    searchString: '',
                })
            }
            tooltip="Close"
        />
    </div>
)
