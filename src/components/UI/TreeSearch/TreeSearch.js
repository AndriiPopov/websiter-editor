import React from 'react'

import * as classes from './TreeSearch.module.css'
import SmallButton from '../Buttons/SmallButton/SmallButton'
import LeftOutlined from '@ant-design/icons/LeftOutlined'
import RightOutlined from '@ant-design/icons/RightOutlined'
import CloseOutlined from '@ant-design/icons/CloseOutlined'
// import type { State } from '../../ElementsTreeAndProperties/ElementsTree/ElementsTree'

// type Props = {
//     state,
//     setState: Function,
// }

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

export const TreeSearch = props => (
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
            icon={<LeftOutlined />}
            buttonClicked={() => selectPrevMatch(props.state, props.setState)}
            tooltip="Search previous"
        />
        <SmallButton
            icon={<RightOutlined />}
            buttonClicked={() => selectNextMatch(props.state, props.setState)}
            tooltip="Search next"
        />
        <SmallButton
            icon={<CloseOutlined />}
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
